
import dotenv from 'dotenv';
dotenv.config({})

export class Config {
    public PORT: string | number;
    public DATABASE_URL: string;

    constructor() {
        this.PORT = process.env.PORT || 4000;
        this.DATABASE_URL = process.env.DATABASE_URL || '';
    }
}