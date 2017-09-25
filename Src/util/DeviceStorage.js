import React, { Component } from 'react';
import {
    AsyncStorage,
} from 'react-native';

export default class DeviceStorage {
    static get(key) {
        return AsyncStorage.getItem(key).then((value) => {
            const jsonValue = JSON.parse(value);
            return jsonValue;
        });
    }

    static getString(key){
        return AsyncStorage.getItem(key).then((value) => {
            return value;
        });
    }

    static save(key, value) {
        return AsyncStorage.setItem(key, JSON.stringify(value));
    }

    static saveString(key,value){
        return AsyncStorage.setItem(key, value);
    }

    static update(key, value) {
        return DeviceStorage.get(key).then((item) => {
            value = typeof value === 'string' ? value : Object.assign({}, item, value);
            return AsyncStorage.setItem(key, JSON.stringify(value));
        });
    }

    static clear(key){
        return AsyncStorage.removeItem(key).then(val=>{return val;});
    }

    static cleanAll(){
        return AsyncStorage.clear();
    }

}