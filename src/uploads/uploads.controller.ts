import { Controller, Post, UploadedFile, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import * as AWS from 'aws-sdk';
import { ConfigService } from '@nestjs/config';

const BUCKET_NAME = 'yelichnubereats5049';

@Controller("uploads")
export class UploadsController{
    constructor(private readonly configureService: ConfigService) {}
    @Post('')
    @UseInterceptors(FileInterceptor('file'))
    async uploadFile(@UploadedFile() file) {
        AWS.config.update({
            credentials: {
                accessKeyId: this.configureService.get('AWS_S3_ACCESSKEYID'),
                secretAccessKey: this.configureService.get('AWS_S3_SECRETACCESSKEY'),
            },
        });
        try {
            const objectName = `${Date.now() + file.originalname}`;
            await new AWS.S3()
            .putObject({
                Key: objectName,
                Body: file.buffer,
                Bucket: BUCKET_NAME,
                ACL: 'public-read',
            }).promise();
            const url = `https://${BUCKET_NAME}.s3.amazonaws.com/${objectName}`;
            return { url };
        } catch(error) {
            console.log(error);
            return null;
        }
    }
}