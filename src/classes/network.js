const baseURL = 'http://localhost/api/v1';

export const createNewQuest = async (quest) => {
    const url = `${baseURL}/quests`;
    try {
        console.log(quest.toJSON());

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: quest.toJSON(),
        });

        if (response.status != 201)
            throw new Error('Network response was not 201');

        const data = await response.json();
        console.log('create Quest response data:', data);
        return data;
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
}

export const readQuest = async (id) => {
    const url = `${baseURL}/quests/${id}`;
    try {
        const response = await fetch(url, {
            method: 'GET'
        });

        if (!response.ok)
            throw new Error('Network response was not ok');

        const data = await response.json();
        console.log('read Quest response data:', data);
        return data;
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
}

export const updateQuest = async (quest) => {
    const url = `${baseURL}/quests/${quest.id}`;
    try {
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: quest.toJSON(),
        });

        if (!response.ok)
            throw new Error('Network response was not ok');

        const data = await response.json();
        console.log('update Quest response data:', data);
        return data;
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
}

export const deleteQuest = async (id) => {
    const url = `${baseURL}/quests/${id}`;
    try {
        const response = await fetch(url, {
            method: 'DELETE'
        });

        if (response.status != 204)
            throw new Error('Network response was not 204');

        console.log('Response:', response.status);
        return true;
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        return false;
    }
}

export const readByOwner = async (id) => {
    const url = `${baseURL}/users/${id}/quests`;
    try {
        const response = await fetch(url, {
            method: 'GET'
        })

        if (!response.ok)
            throw new Error('Network response was not ok');

        const data = await response.json();
        console.log('byOwner Quests response data:', data);
        return data;
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
}

export const readByParent = async (id) => {
    const url = `${baseURL}/quests/${id}/subquests`;
    try {
        const response = await fetch(url, {
            method: 'GET'
        });

        if (!response.ok)
            throw new Error('Network response was not ok');

        const data = await response.json();
        console.log('byParent Quest response data:', data);
        return data;
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
}