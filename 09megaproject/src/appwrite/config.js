// Appwrite configuration
import conf from '../conf/conf';
import { Client, ID, Databases, Storage, Query } from 'appwrite';

export class Service {
  client = new Client();
  databases;
  bucket;

  constructor() {
    this.client
      .setEndpoint(conf.appwriteUrl)
      .setProject(conf.appwriteProjectId);
    this.databases = new Databases(this.client);
    this.bucket = new Storage(this.client);
  }

  async createPost({ title, slug, content, featureimage, status, userId }) {
    try {
      console.log('featuredImage', featureimage);
      console.log('appwriteDatabaseId ', conf.appwriteDatabaseId);
      const createdPost = await this.databases.createDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        slug, // can also be ID.unique()
        {
          title,
          content,
          featureimage: featureimage,
          status,
          userid: userId,
        }
      );
      console.log('Post created ! ✅');
      return createdPost;
    } catch (error) {
      console.log('Appwrite service :: createPost :: error: ', error);
      throw error;
    }
  }
  async createFeedbackPost({ firstName, lastName, email, message }) {
    try {
      // console.log('userId: ', userId);
      const createdPost = await this.databases.createDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        ID.unique(),
        {
          firstName,
          lastName: lastName ? lastName : '',
          email,
          message,
        }
      );
      console.log('Feedback Post created ! ✅');
      return createdPost;
    } catch (error) {
      console.log('Appwrite service :: createFeedbackPost :: error: ', error);
      throw error;
    }
  }

  async updatePost(slug, { title, content, featureimage, status }) {
    try {
      const updatedPost = await this.databases.updateDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        slug,
        {
          title,
          content,
          featureimage,
          status,
        }
      );
      console.log('Post updated: (in appwrite.config.js)');
      return updatedPost;
    } catch (error) {
      console.log('Appwrite service :: updatePost :: error: ', error);
    }
  }

  async deletePost(slug) {
    try {
      await this.databases.deleteDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        slug
      );
      console.log('Post deleted: ', slug);
      return true;
    } catch (error) {
      console.log('Appwrite service :: deletePost :: error: ', error);
      return false;
    }
  }

  async getPost(slug) {
    try {
      const fetchOnePost = await this.databases.getDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        slug
      );
      // console.log('Post fetched: ', fetchOnePost);
      return fetchOnePost;
    } catch (error) {
      console.log('Appwrite service :: getDocument :: error: ', error);
      throw error;
    }
  }

  async getPosts(queries = [Query.equal('status', ['active'])]) {
    try {
      // console.log('props: ', props[0]);
      const fetchPosts = await this.databases.listDocuments(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        queries
        // TODO: Check for queries based on userId, where post shown by user who has created it
        // [Query.equal("status", "active")]
      );
      // console.log('Posts fetched (in getPosts): ', fetchPosts);
      return fetchPosts;
    } catch (error) {
      console.log('Appwrite service :: getPosts :: error: ', error);
      throw error;
      // return false;
    }
  }

  // file upload service

  async uploadFile(file) {
    try {
      const fileUploadResponse = await this.bucket.createFile(
        conf.appwriteBucketId,
        ID.unique(),
        file
      );
      console.log('File uploaded: ', fileUploadResponse);
      return fileUploadResponse;
    } catch (error) {
      console.log('Appwrite service :: uploadFile :: error: ', error);
      return error;
    }
  }

  async deleteFile(fileId) {
    try {
      await this.bucket.deleteFile(conf.appwriteBucketId, fileId);
      console.log('File deleted: ', fileId);
      return true;
    } catch (error) {
      console.log('Appwrite service :: deleteFile :: error: ', error);
      return false;
    }
  }

  getFilePreview(fileId, width, height, gravity, quality) {
    return this.bucket.getFilePreview(
      conf.appwriteBucketId,
      fileId,
      width ? width : 0,
      height ? height : 0,
      gravity ? gravity : undefined,
      quality ? quality : 100
    );
  }
}

const service = new Service();

export default service;
