const Docker = require('dockerode');

const docker = new Docker({ host: 'http://localhost', port: 2375 });

require("dotenv").config();
const URL_SERVICE_CRUD_DOCKER = process.env.URL_SERVICE_CRUD_DOCKER;
const URL_SERVICE_INTELLIGENCE_DOCKER = process.env.URL_SERVICE_INTELLIGENCE_DOCKER;

function generateNameContainer(userId) {
    return `U${userId}`
}

module.exports = {

    async initDocker(userId) {

        const name = generateNameContainer(userId);

        try {
            console.log('Construindo imagem...');

            const stream = await docker.buildImage({
                context: __dirname,
                src: ['Dockerfile', 'snnifer-docker.js', 'package.json']
            }, { t: 'image_docker_snnifer' });

            await new Promise((resolve, reject) => {
                docker.modem.followProgress(stream, (err, res) => err ? reject(err) : resolve(res));
            });

            console.log('Imagem construída com sucesso.');

            const images = await docker.listImages();
            const imageExists = images.some(image => image.RepoTags.includes('image_docker_snnifer:latest'));

            if (!imageExists) {
                throw new Error('Imagem não encontrada após a construção.');
            }

            const container = await docker.createContainer({
                Image: 'image_docker_snnifer',
                name,
                Env: [`USER_ID=${userId}`, `URL_SERVICE_CRUD_DOCKER=${URL_SERVICE_CRUD_DOCKER}`, `URL_SERVICE_INTELLIGENCE_DOCKER=${URL_SERVICE_INTELLIGENCE_DOCKER}`],
                Tty: true,
                HostConfig: {
                    NetworkMode: 'host'
                }
            });

            await container.start();

        } catch (error) {

            if (error.statusCode === 409) {
                const existingContainer = docker.getContainer(name);
                await existingContainer.restart();
            } else {
                throw error;
            }

        }
    },

    async isContainerRunning(userId) {
        try {
            const container = docker.getContainer(generateNameContainer(userId));
            const data = await container.inspect();
            return data.State.Running;
        } catch (error) {
            return false;
        }
    }
}
