'use strict';

const postAddress = {
    method: 'POST',
    uri: 'http://localhost:8081/addr',
    json: true,
    body: {
     'address': 'test_addres',
     'erc20tokens': ['erc20_test_token'],
     'nem': ['nemtest']     
    }
};

const deleteAddress = {
    method: 'DELETE',
    uri: 'http://localhost:8081/addr',
    json: true,
    body: {
     'address': 'test_addres'
    }
};

module.exports = {
    postAddress,
    deleteAddress
};