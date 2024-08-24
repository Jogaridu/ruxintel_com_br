const Docker = require('dockerode');

const docker = new Docker({ host: 'http://localhost', port: 2375 });

async function initDocker(userId) {

    const name = `U${userId}`;

    try {
        // Constrói a imagem a partir do Dockerfile
        const stream = await docker.buildImage({
            context: __dirname,
            src: ['Dockerfile', 'snnifer-docker.js', 'package.json']
        }, { t: 'image_docker_snnifer2' });

        await new Promise((resolve, reject) => {
            docker.modem.followProgress(stream, (err, res) => err ? reject(err) : resolve(res));
        });

        console.log('Imagem construída com sucesso.');

        const images = await docker.listImages();
        const imageExists = images.some(image => image.RepoTags.includes('image_docker_snnifer2:latest'));

        if (!imageExists) {
            throw new Error('Imagem não encontrada após a construção.');
        }

        const container = await docker.createContainer({
            Image: 'image_docker_snnifer2',
            name,
            Env: [`USER_ID=${userId}`],
            Tty: true,
        });

        await container.start();

        console.log(name);
        // salvar nome do container no usuario
    } catch (error) {

        if (error.statusCode === 409) {

            const existingContainer = docker.getContainer(name);
            await existingContainer.restart();

        } else {

            throw error;
        }
    }
}

module.exports = initDocker

// fazer lógica com docker - CONCLUIDO

// PRÓXIMAS ATIVIDADES
// integrar arquivo docker com API oficial
// melhorar "validar instancia" para validar se o container está de pé
// avaliar para nao buildar toda vez, talvez de pra usar uma imagem apenas
// caso não, alterar o status e encerrar a sessão do qrcode do usuario no front
// testar com mais um usuario simultaneo

// salvar dados extras de midia
// melhorar trativas de erro nas apis

// hospedar na aws
