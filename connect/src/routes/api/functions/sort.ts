import { User, IUser } from "../../../models/user";

export async function insertionSortFriends(user: IUser): Promise<void> {
  const friends = await User.find({ _id: { $in: user.friends } });

  for (let i = 1; i < friends.length; i++) {
    const currentFriend = friends[i];
    let j = i - 1;

    while (j >= 0 && friends[j].username && friends[j].username.localeCompare(currentFriend.username) > 0) {
      friends[j + 1] = friends[j];
      j--;
    }

    friends[j + 1] = currentFriend;
  }

  user.friends = friends.map((friend) => friend._id.toString());
}