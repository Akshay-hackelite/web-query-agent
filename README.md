**🌐 Web Query Agent**
A full-stack intelligent agent that:

1)Accepts user queries through a React UI

2)Classifies them as valid or invalid using a local zero-shot LLM

3)Searches the web in real-time using Serper.dev (Brave Search API)

4)Scrapes the top pages and summarizes them using a local summarization model

5)Caches and retrieves similar queries using vector embeddings in MongoDB Atlas with vector search


**🚀 Features**
✅ Query classification (valid vs invalid)

🌐 Real-time web search via Brave (Serper.dev)

🧠 LLM-powered summarization (using local transformer model)

⚡ Embedding-based semantic caching

💾 MongoDB Atlas vector similarity

💡 Fast frontend with loader animation


🛠️ **Tech Stack**
Frontend: React + CSS

Backend: Node.js + Express

NLP Models: @xenova/transformers (local, no API keys needed)

Classification: Xenova/nli-deberta-base

Summarization: Xenova/distilbart-cnn-12-6

Embeddings: Xenova/all-MiniLM-L6-v2

Vector Store: MongoDB Atlas (vector index on embedding)

Search API: Serper.dev (free Brave search)



**🔐 Environment Variables**
Create a .env file in backend/:

MONGO_URI=your_mongodb_connection_string
SERPER_API_KEY=your_serper_dev_api_key

**💻 Setup Instructions**
1. Clone the repo:
   git clone https://github.com/<your-username>/web-query-agent.git
   cd web-query-agent

2. Install dependencies:
    cd backend
    npm install
    
    cd ../frontend
    npm install
  
3. Go to mongoDB Atlas, then make a cluster,then go to database access and add a user then go to network access and add this address 0.0.0.0/0 so that every request is allowed from any origin. then paste this connection string in .env.
   **(Vector Search Setup)**
   now after that you have to go to mongodb atlas again and go to atlas search then create index(JSON) then choose our collection and paste this:
    {
      "mappings": {
        "dynamic": false,
        "fields": {
          "embedding": {
            "type": "vector",
            "dimensions": 384,
            "similarity": "cosine"
          }
        }
      }
   }

4. Sign up on serper api and generate a key and paste it in .env 

5. Start the backend:
   cd backend
   node app.js

6. Start the frontend:
  cd frontend
  npm start

**Web Architecture**








