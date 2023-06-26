import mongoose, {Schema, model} from 'mongoose';

export interface IGroups{
    name: string
    users: Array<String>
    creator: string
}

const GroupSchema = new Schema<IGroups>({
    creator: {
        type: String,
    },
	name: {
		type: String,
		required: true,
	},
	users:[{
		type: String,
		ref: "User"
	}],
});

export const Group = model<IGroups>('Group', GroupSchema);