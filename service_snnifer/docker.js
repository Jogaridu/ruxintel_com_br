const Docker = require('dockerode');

const docker = new Docker({ host: 'http://localhost', port: 2375 });

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
                Env: [`USER_ID=${userId}`],
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

// fazer lógica com docker - CONCLUIDO
// integrar arquivo docker com API oficial - CONCLUIDO
// melhorar "validar instancia" para validar se o container está de pé - CONCLUIDO
// avaliar para nao buildar toda vez, talvez de pra usar uma imagem apenas - CONCLUIDO
// caso não, alterar o status e encerrar a sessão do qrcode do usuario no front - CONCLUIDO
// melhorar trativas de erro nas apis - CONCLUIDO

// PRÓXIMAS ATIVIDADES
// testar com mais um usuario simultaneo
// salvar dados extras de midia
// hospedar na aws


