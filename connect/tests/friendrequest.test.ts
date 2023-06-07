import request from 'supertest';
import express from 'express';
import { friendRequests } from '../routes/api/friendrequests';
import { User } from '../models/user';
import { request as requestModel } from '../models/request';

jest.mock('../models/user');
jest.mock('../models/request');

describe('friendRequests', () => {
    let app: express.Application;
  
    beforeEach(() => {
      app = express();
      app.use(express.json());
      app.use('/', friendRequests);
    });
  
    afterEach(() => {
      jest.clearAllMocks();
    });
  
    test('should send a friend request and return a success response', async () => {
      const senderUsername = 'sender123';
      const receiverUsername = 'receiver456';
  
      const sender: jest.Mocked<any> = {
        _id: 'senderId',
        save: jest.fn(),
        outgoingrequests: [],
      };
  
      const receiver: jest.Mocked<any> = {
        _id: 'receiverId',
        save: jest.fn(),
        incomingrequests: [],
      };
  
      (User.findOne as jest.Mock).mockResolvedValueOnce(sender);
      (User.findOne as jest.Mock).mockResolvedValueOnce(receiver);
  
      const response = await request(app)
        .post('/api/sendFriendRequest')
        .send({ senderUsername, receiverUsername });
      
      expect(response.status).toBe(201);
      expect(response.body.message).toBe('${requestType} request created');
      expect(sender.save).toHaveBeenCalled();
      expect(receiver.save).toHaveBeenCalled();
    });
  
    test('should return a 404 error if sender or receiver not found', async () => {
      (User.findOne as jest.Mock).mockResolvedValueOnce(null);
      (User.findOne as jest.Mock).mockResolvedValueOnce(null);
  
      const response = await request(app)
        .post('/api/sendFriendRequest')
        .send({ senderUsername: 'sender123', receiverUsername: 'receiver456' });
  
      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Sender or receiver not found');
    });
  
    test('should return a 500 error if an error occurs', async () => {
      (User.findOne as jest.Mock).mockImplementationOnce(() => {
        throw new Error('Database error');
      });
  
      const response = await request(app)
        .post('/api/sendFriendRequest')
        .send({ senderUsername: 'sender123', receiverUsername: 'receiver456' });
  
      expect(response.status).toBe(500);
      expect(response.body.message).toBe('Server error');
    });

    test('should accept a friend request and return a success response', async () => {
        const requestId = 'requestId';
    
        const friendReq = {
          senderId: 'senderId',
          receiverId: 'receiverId',
        };
    
        const sender = {
          _id: friendReq.senderId,
          friends: [],
          save: jest.fn(),
        };
    
        const receiver = {
          _id: friendReq.receiverId,
          friends: [],
          save: jest.fn(),
        };
    
        (requestModel.findById as jest.Mock).mockResolvedValueOnce(friendReq);
        (User.findById as jest.Mock).mockResolvedValueOnce(sender);
        (User.findById as jest.Mock).mockResolvedValueOnce(receiver);
        (requestModel.findByIdAndDelete as jest.Mock).mockResolvedValueOnce({});
    
        const response = await request(app).put(`/api/acceptFriendRequest/${requestId}`);
    
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Friend request accepted');
        expect(sender.friends).toContain(receiver._id);
        expect(receiver.friends).toContain(sender._id);
        expect(sender.save).toHaveBeenCalled();
        expect(receiver.save).toHaveBeenCalled();
        expect(requestModel.findByIdAndDelete).toHaveBeenCalledWith(requestId);
        expect(User.findByIdAndUpdate).toHaveBeenCalledWith(sender._id, {
          $pull: { incomingrequests: requestId },
        });
        expect(User.findByIdAndUpdate).toHaveBeenCalledWith(receiver._id, {
          $pull: { outgoingrequests: requestId },
        });
      });
    
      test('should return a 404 error if friend request not found', async () => {
        (requestModel.findById as jest.Mock).mockResolvedValueOnce(null);
    
        const response = await request(app).put('/api/acceptFriendRequest/requestId');
    
        expect(response.status).toBe(404);
        expect(response.body.message).toBe('Friend request not found');
      });
    
      test('should return a 404 error if sender or receiver not found', async () => {
        (requestModel.findById as jest.Mock).mockResolvedValueOnce({ senderId: 'senderId', receiverId: 'receiverId' });
        (User.findById as jest.Mock).mockResolvedValueOnce(null);
        (User.findById as jest.Mock).mockResolvedValueOnce(null);
    
        const response = await request(app).put('/api/acceptFriendRequest/requestId');
    
        expect(response.status).toBe(404);
        expect(response.body.message).toBe('Sender or receiver not found');
      });
    
      test('should return a 500 error if an error occurs', async () => {
        (requestModel.findById as jest.Mock).mockRejectedValueOnce(new Error('Database error'));
    
        const response = await request(app).put('/api/acceptFriendRequest/requestId');
    
        expect(response.status).toBe(500);
        expect(response.body.message).toBe('Server error');
      });

      test('should get friend requests and return a success response', async () => {
        const userId = 'userId';
    
        const user: jest.Mocked<any> = {
          _id: userId,
          outgoingrequests: ['requestId1', 'requestId2'],
          incomingrequests: ['requestId3', 'requestId4'],
        };
    
        (User.findById as jest.Mock).mockResolvedValueOnce(user);
    
        const outgoingReq1 = {
          _id: 'requestId1',
          requestType: 'friend',
        };
    
        const outgoingReq2 = {
          _id: 'requestId2',
          requestType: 'friend',
        };
    
        const incomingReq1 = {
          _id: 'requestId3',
          requestType: 'friend',
        };
    
        const incomingReq2 = {
          _id: 'requestId4',
          requestType: 'friend',
        };
    
        (User.find as jest.Mock).mockResolvedValueOnce([outgoingReq1, outgoingReq2]);
        (User.find as jest.Mock).mockResolvedValueOnce([incomingReq1, incomingReq2]);
    
        const response = await request(app).get(`/api/${userId}/getFriendReqs`);
    
        expect(response.status).toBe(200);
        expect(response.body.outgoing).toEqual([outgoingReq1, outgoingReq2]);
        expect(response.body.incoming).toEqual([incomingReq1, incomingReq2]);
      });
    
      test('should return a 404 error if user not found', async () => {
        (User.findById as jest.Mock).mockResolvedValueOnce(null);
    
        const response = await request(app).get('/api/userId/getFriendReqs');
    
        expect(response.status).toBe(404);
        expect(response.body.message).toBe('User not found');
      });
    
      test('should return a 500 error if an error occurs', async () => {
        (User.findById as jest.Mock).mockImplementationOnce(() => {
          throw new Error('Database error');
        });
    
        const response = await request(app).get('/api/userId/getFriendReqs');
    
        expect(response.status).toBe(500);
        expect(response.body.message).toBe('Server error');
      });

    describe('Friend Requests API', () => {
        beforeAll(() => {
          jest.mock('../models/request');
          jest.mock('../models/user');
        });
      
        afterAll(() => {
          jest.restoreAllMocks();
        });
      
        afterEach(() => {
          jest.clearAllMocks();
        });
      
        test('should return a 500 error if an error occurs in getRequest', async () => {
          (User.findById as jest.Mock).mockRejectedValueOnce(new Error('Database error'));
      
          const response = await request(app).get('/api/userId/getFriendReqs');
      
          expect(response.status).toBe(500);
          expect(response.body.message).toBe('Server error');
        });
      });
    });