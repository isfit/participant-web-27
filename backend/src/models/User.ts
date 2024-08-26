import { Schema, model, Document, Model, CallbackError } from 'mongoose';
import bcrypt from 'bcrypt';

interface IUser {
    fullName: string;
    email: string;
    password: string;
    role: string;
    comparePassword: (password: string) => Promise<boolean>;
};


const userSchema = new Schema<IUser>({
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['ADMIN', 'USER'],
        default: 'USER'
    }
});

userSchema.pre('save', async function (next) {
    const user = this;
    if (!user.isModified('password')) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(user.password, salt);
        user.password = hash;
        next();

    } catch (error) {
        return next(error as CallbackError);
    }

});

// Compare password given, with the one in the database
userSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.password);
}


const User = model<IUser>('User', userSchema);


export default User;