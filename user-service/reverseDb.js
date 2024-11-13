import { Level } from 'level';

const reverseDb = new Level('./reverseDb');

export const getDataReverse = async (key) => {
    try {
        await reverseDb.get(key);
    } catch (error) {
        console.error('Error setting data with reverse mapping:', error);
    }
};

export const setDataReverse = async (key, value) => {
    try {
        await reverseDb.put(key, value);
    } catch (error) {
        console.error('Error setting data with reverse mapping:', error);
    }
};

export const deleteDataReverse = async (key) => {
    try {
        await reverseDb.del(key);
    } catch (error) {
        console.error('Error setting data with reverse mapping:', error);
    }
};

export default reverseDb;