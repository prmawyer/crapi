from gc import collect
import hashlib

from langchain.memory import vectorstore
from langchain_openai import OpenAIEmbeddings
from langchain.chains import RetrievalQAWithSourcesChain, LLMChain
import os
from langchain_openai import OpenAI
from langchain_community.document_loaders import DirectoryLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_core.vectorstores import InMemoryVectorStore
from langchain_mongodb import MongoDBAtlasVectorSearch
from langchain_community.document_loaders import UnstructuredMarkdownLoader
import logging
from langchain_community.vectorstores.azure_cosmos_db import (
    AzureCosmosDBVectorSearch,
    CosmosDBSimilarityType,
    CosmosDBVectorSearchType,
)
from db import MONGO_CONNECTION_URI, MONGO_DB_NAME
from pymongo import MongoClient
from langchain_chroma import Chroma
from langchain_core.runnables import RunnableLambda, RunnablePassthrough


logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)

TARGET_SOURCE_CHUNKS = int(os.environ.get("TARGET_SOURCE_CHUNKS", 4))


def get_embeddings(openai_api_key):
    return OpenAIEmbeddings(openai_api_key=openai_api_key)


def get_vector_store(texts, embeddings, key_hash):
    # initialize MongoDB python client
    db_path = "./db%s" % key_hash
    collection = "example_collection"
    vector_store = Chroma(collection, embeddings, persist_directory=db_path)
    vector_store.add_documents(texts)
    return vector_store


def document_loader(openai_api_key, logger_p=None):
    logger_l = logger_p or logger
    try:
        key_hash = hashlib.md5(openai_api_key.encode()).hexdigest()
        load_dir = "./retrieval"
        logger_l.info("Loading documents from %s", load_dir)
        loader = DirectoryLoader(
            load_dir,
            exclude=["**/*.png", "**/images/**", "**/images/*", "**/*.pdf"],
            recursive=True,
            show_progress=True,
        )
        documents = loader.load()
        logger_l.info("Loaded %s documents in db", len(documents))
        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000, chunk_overlap=100
        )
        texts = text_splitter.split_documents(documents)
        embeddings = get_embeddings(openai_api_key)
        vector_store = get_vector_store(texts, embeddings, key_hash)
        retriever = vector_store.as_retriever(search_kwargs={"k": TARGET_SOURCE_CHUNKS})
        logger_l.info("Retriever ready")
        return retriever
    except Exception as e:
        logger_l.error("Error loading documents %s", e, exc_info=True)
        raise e
