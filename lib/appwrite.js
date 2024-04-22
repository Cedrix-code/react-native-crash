import { Account, Avatars, Client, Databases, ID } from 'react-native-appwrite';

export const config = {
    endpoint: 'https://cloud.appwrite.io/v1',
    platform: 'com.crx.alora',
    projectId: '6623ee54642cdcba93e2',
    databaseId: '6623eff770dfc3cd849d',
    userCollectionId: '6623f02c4b49d1e88f65',
    videoCollectionId: '6623f05403a813a56d31',
    storageId: '6623f27090fd3fe71f16'
}

const {
    endpoint,
    platform,
    projectId,
    databaseId,
    userCollectionId,
    videoCollectionId,
    storageId,
} = config;
// Init your react-native SDK
const client = new Client();

client
    .setEndpoint(config.endpoint)
    .setProject(config.projectId)
    .setPlatform(config.platform)

    const account = new Account(client);
    const avatars = new Avatars(client);
    const databases = new Databases(client);

    export const createUser = async (email, password, username) => {
        try {
            const newAccount = await account.create(
                ID.unique(),
                email,
                password,
                username
            )

            if(!newAccount) throw Error;

            const avatarUrl = avatars.getInitials(username)

            await signIn(email, password);

            const newUser = await databases.createDocument(
                config.databaseId,
                config.userCollectionId,
                ID.unique(),
                {
                    accountId: newAccount.$id,
                    email,
                    username,
                    avatar: avatarUrl
                }
            )

            return newUser;
        } catch (error) {
            console.log(error);
            throw new Error(error);
        }
    }

    export const signIn = async (email, password) => {
        try {
            const session = await account.createEmailSession(email, password)

            return session;
        } catch (error) {
            throw new Error(error);
        }
    }

    export const getCurrentUser = async () => {
        try {
            const currentAccount = await account.get();

            if(!currentAccount) throw Error;

            const currentUser = await databases.listDocuments(
                config.databaseId,
                config.userCollectionId,
                [
                    Query.equal('accountId', currentAccount.$id)
                ]
            )

            if(!currentUser) throw Error;

            return currentUser.documents[0];
        } catch (error) {
            console.log(error)
        }
    }   

    export const getAllPosts = async () => {
        try {
            const posts = await databases.listDocuments(
                databaseId,
                videoCollectionId
            )

            return posts.documents;
        } catch (error) {
            throw new Error(error);
        }
    }