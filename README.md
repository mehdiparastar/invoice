<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

If you are using Windows, you may run into issues running the project in Docker & using hot-reloading. This is because since we are using a Linux-based image to run the project, we also need to build the project in a Linux environment.

Please refer to the following article to enable WSL2 on Windows using Docker Desktop: https://docs.docker.com/desktop/windows/wsl/

Once enabled, you can install Ubuntu from the Microsoft Store, and then run the project through Ubuntu. Make sure to rebuild the project by running docker-compose up --build

Finally - make sure your application (the physical directory on your filesystem) is inside the WSL2 filesystem, not the Windows filesystem: https://www.howtogeek.com/426749/how-to-access-your-linux-wsl-files-in-windows-10/

## Project setup and run the project

```bash
# [Development mode]: 
0) $ npm install -g pnpm  # only once required
1) $ pnpm install -r   # only once required
2) $ docker compose -f ./docker-compose.development.yaml up -d --build

# [Production mode]: 
0) $ npm install -g pnpm  # only once required
1) $ pnpm install -r   # only once required
2) $ docker compose -f ./docker-compose.production.yaml up -d --build
```

## Run tests

```bash
# e2e tests
0) $ npm install -g pnpm  # only once required
1) $ pnpm install -r   # only once required
2) $ pnpm run test:e2e
```

## Resources

- [NestJS Documentation](https://docs.nestjs.com).
- [Udemy - NestJS Microservices: Build & Deploy a Scaleable Backend](https://www.udemy.com/course/nestjs-microservices-build-deploy-a-scaleable-backend/?srsltid=AfmBOoodYUee_ffVSgqwGik05pmBgnQ0lIOh_Y9Y_njR1y59Bi6bOc1q).


## Support

parastar.mehdi@gmail.com

## Stay in touch

- Author - [Mehdi Parastar](parastar.mehdi@gmail.com)
- Linkedin - [profile](https://www.linkedin.com/in/mehdi-parastar-a7567516b/)


## License

[MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
