import { ApolloServer,gql } from "apollo-server";

let tweets = [
    {
        id:"1",
        text:"first hello",
        userId:"2"
    },
    {
        id:"2",
        text:"second hello",
        userId:"1"
    },
]

let users = [
    {
        id:"1",
        firstName:"lee",
        lastName:"hyunjin",
    },
    {
        id:"2",
        firstName:"lee",
        lastName:"seongbum",
    }
]

// SDL schema정의
const typeDefs = gql`
    type User{
        id:ID!
        username:String!
        firstName:String!
        lastName:String!
        fullName:String!
    }
    type Tweet{
        id:ID!
        text:String!
        author:User!
    }
    type Query{
        allUsers:[User!]!
        allTweets:[Tweet]!
        tweet(id:ID!) : Tweet
    }
    type Mutation{
        postTweet(text:String!,userId:ID!):Tweet!
        deleteTweet(id:ID!):Boolean!
    }
`

const resolvers = {
    Query:{
        allTweets(){
            return tweets
        },
        tweet(root,args){
            console.log('args',{id})
            return tweets.find(tweet=>tweet.id === id)
        },
        allUsers(){
            return users;
        }
    },
    Mutation: {
        postTweet(root,{text,userId}){
            // user데이터베이스에서 해당하는 user인지 확인
            const user = users.find(user=>user.id===userId)
            console.log('userId',user)
            if(!user) throw new Error(`User ID ${userId} is not found.`);

            // 새 트윗 만들기
            const newTweet = {
                id:String(tweets.length+1),
                text,
                userId
            }
            tweets.push(newTweet)
            console.log('tweets',tweets)
            return newTweet
        },
        deleteTweet(root,{id}){
            const tweet = tweets.find(tweet=>tweet.id === id)
            if(!tweet) return false
            tweets = tweets.filter(tweet=>tweet.id !== id)
            console.log('삭제된 tweets',tweets)
            return true
        }
    },
    User:{
        fullName({firstName,lastName}){
            return `${firstName} ${lastName}`
        }
    },
    Tweet:{
        author({userId}){
            return users.find(user=>user.id === userId)
        }
    }
}

const server = new ApolloServer({typeDefs,resolvers})

server.listen().then(({url})=>{
    console.log(`Running on ${url}`)
})