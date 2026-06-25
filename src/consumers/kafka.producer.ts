import { kafkaConfig } from "./kafka";

export const kafkaProducer = (groupId: string) => {
    return kafkaConfig(groupId).producer({idempotent: true});
};