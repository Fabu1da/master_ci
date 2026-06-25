import {kafkaConfig} from "./kafka";

export const kafkaConsumer = (groupId: string) => {
    const kafka = kafkaConfig(groupId);
    return kafka.consumer({ groupId });

}