import { Level } from 'level';
import path from 'path';
import reverseDb, {getDataReverse, deleteDataReverse} from './reverseDb.js';

const dbPath = path.resolve('./mydb');

const db = new Level(dbPath);

// key is the user, value is the roomId.
export const setData = async (key, value) => {
    try {
        // store roomId to a user key entry. 
        await db.put(key, value);

        const users = await getDataReverse(value)

        // append another user to the roomId key entry. 
        await reverseDb.put(value, [key, ...users])

        console.log(`Data saved: ${key} = ${value}`);
    } catch (error) {
        console.error('Error saving data:', error);
    }
};

export const deleteRoom = async (key) => {
    try {
        // traverse through each user in reverseDb

        console.log("delete room working?")
        const users = await getDataReverse(key); 
        users.forEach(async user =>  {
            await db.del(user)
        })
        await deleteDataReverse(key); 

    } catch (error) {
        console.log('Error deleting data:', error)
    }
}

export const getData = async (key) => {
    try {
        const value = await db.get(key);
        console.log(`Retrieved data: ${key} = ${value}`);
        return value
    } catch (error) {
        if (error.notFound) {
            console.log(`Key not found: ${key}`);
        } else {
            console.error('Error retrieving data:', error);
        }
    }
};

export default db;