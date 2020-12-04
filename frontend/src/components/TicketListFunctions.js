import axios from 'axios'

export const getList = token => {
    return axios
        .get('/api/tickets', {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            }
        })
        .then(res => {
            res.data.status = 'success'
            return res.data
        }).catch(err => {
            return {
                error: 'Please login again!',
                status: 'failed',
                message: err.message
            }
        })
}

export const addToList = ticket => {
    return axios
        .post(
            '/api/ticket', {
                name: ticket.name,
                status: ticket.status
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': ticket.token
                }
            }
        )
        .then(function(response) {
            return response.data;
        }).catch(err => {
            return {
                error: 'Error to add',
                status: 'failed',
                message: err.message
            }
        })
}

export const deleteItem = (ticket, token) => {
    return axios
        .delete(`/api/ticket/${ticket}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            }
        })
        .then(function(response) {
            console.log(response)
            return response;
        })
        .catch(function(error) {
            console.log(error)
            return error;
        })
}

export const updateItem = ticketUpdateRequest => {
    return axios
        .put(
            `/api/ticket/${ticketUpdateRequest.id}`, {
                name: ticketUpdateRequest.name,
                status: ticketUpdateRequest.status
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': ticketUpdateRequest.token
                }
            }
        )
        .then(function(response) {
            return response.data;
        })
}



export const getType = token => {
    return axios
        .get('/api/parking_spot_type', {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            }
        })
        .then(res => {
            res.data.status = 'success'
            return res.data
        }).catch(err => {
            return {
                error: 'Please login again!',
                status: 'failed',
                message: err.message
            }
        })
}




export const getLot = token => {
    return axios
        .get('/api/lots', {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            }
        })
        .then(res => {
            res.data.status = 'success'
            return res.data
        }).catch(err => {
            return {
                error: 'Please login again!',
                status: 'failed',
                message: err.message
            }
        })
}





export const getSpot = token => {
    return axios
        .get('/api/lots', {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            }
        })
        .then(res => {
            res.data.status = 'success'
            return res.data
        }).catch(err => {
            return {
                error: 'Please login again!',
                status: 'failed',
                message: err.message
            }
        })
}