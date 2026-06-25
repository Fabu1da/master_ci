const TYPES = {
    DB: Symbol.for("DB"),
    KafkaProducer: Symbol.for("KafkaProducer"),
    PostService: Symbol.for("PostService"),
    PostRepository: Symbol.for("PostRepository"),
    PostMapper: Symbol.for("PostMapper"),
    UserRepository: Symbol.for("UserRepository"),
    UserService: Symbol.for("UserService"),
    UserMapper: Symbol.for("UserMapper")
    
};

export { TYPES };