const fs = require('fs');
const request = require('request');
const path = require('path');
const exec = require('child_process').exec;

const packageJsonUrl = 'https://raw.githubusercontent.com/Az-png/Extaz-rpc/main/package.json';
const packageJsonPath = path.join(__dirname, 'package.json');
const indexJsUrl = 'https://raw.githubusercontent.com/Az-png/Extaz-rpc/main/index.js';
const indexJsPath = path.join(__dirname, 'index.js');


console.log("\x1b[31m%s\x1b[0m", "\n\n\n/$$$$$$$$             /$$                        ");
console.log("\x1b[31m%s\x1b[0m", "| $$_____/            | $$                        ");
console.log("\x1b[31m%s\x1b[0m", "| $$       /$$   /$$ /$$$$$$    /$$$$$$  /$$$$$$$$");
console.log("\x1b[31m%s\x1b[0m", "| $$$$$   |  $$ /$$/|_  $$_/   |____  $$|____ /$$/");
console.log("\x1b[31m%s\x1b[0m", "| $$__/    \\  $$$$/   | $$      /$$$$$$$   /$$$$/ ");
console.log("\x1b[31m%s\x1b[0m", "| $$        >$$  $$   | $$ /$$ /$$__  $$  /$$__/  ");
console.log("\x1b[31m%s\x1b[0m", "| $$$$$$$$ /$$/\\  $$  |  $$$$/|  $$$$$$$ /$$$$$$$$");
console.log("\x1b[31m%s\x1b[0m", "|________/|__/  \\__/   \\___/   \\_______/|________/");


function checkForUpdates() {
  console.log('\x1b[95m' + '\n\nVérification des mises à jour...' + '\x1b[0m');

  request(packageJsonUrl, (error, response, body) => {
    if (error) {
      console.error('\x1b[31m' + '\nUne erreur s\'est produite lors de la vérification des mises à jour :', error + '\x1b[0m');
      return;
    }

    if (response.statusCode !== 200) {
      console.error('\x1b[31m' +  '\nLa requête de vérification des mises à jour a retourné une réponse non valide :', response.statusCode + '\x1b[0m');
      return;
    }

    const packageJsonData = JSON.parse(body);

    fs.readFile(packageJsonPath, 'utf-8', (err, data) => {
      if (err) {
        console.error('\x1b[31m' +  '\nUne erreur s\'est produite lors de la lecture du fichier package.json :', err + '\x1b[0m');
        return;
      }

      const currentPackageJson = JSON.parse(data);

      if (currentPackageJson.version !== packageJsonData.version) {
        console.log('\x1b[33m' + '\nUne nouvelle version est disponible. Téléchargement en cours...' + '\x1b[0m');

        request(indexJsUrl, (err, res, body) => {
          if (err) {
            console.error('\x1b[31m' +  '\nUne erreur s\'est produite lors du téléchargement de la mise à jour :', err  + '\x1b[0m');
            return;
          }

          if (res.statusCode !== 200) {
            console.error('\x1b[31m' +  '\nLa requête de téléchargement de la mise à jour a retourné une réponse non valide :', res.statusCode + '\x1b[0m');
            return;
          }

          fs.writeFile(indexJsPath, body, 'utf-8', (error) => {
            if (error) {
              console.error('\x1b[31m' +  '\nUne erreur s\'est produite lors de l\'écriture du fichier index.js :', error + '\x1b[0m');
              return;
            }

            console.log('\x1b[32m' + '\nMise à jour effectuée avec succès.' + '\x1b[0m');

            // Mettre à jour le fichier package.json
            fs.writeFile(packageJsonPath, JSON.stringify(packageJsonData, null, 2), 'utf-8', (error) => {
              if (error) {
                console.error('\x1b[31m' + '\nUne erreur s\'est produite lors de la mise à jour du fichier package.json :', error + '\x1b[0m');
                return;
              }

              console.log('\x1b[32m' + '\nLe fichier package.json a été mis à jour.' + '\x1b[0m');

              // Redémarrer le script
              console.log('\x1b[36m' + '\nRedémarrage du script...' + '\x1b[0m');
              process.exit();
            });
          });
        });
      } else {
        console.log('\x1b[34m' + '\nLe script est à jour. Aucune mise à jour disponible.' + '\x1b[0m');
      }
    });
  });
}

checkForUpdates();

// Votre code d'origine
const DiscordRPC = require('discord-rpc');
const config = require('./config.json');

const clientId = config.clientId;
const images = config.images;
const details = config.details;
const state = config.state;
const largeImageText = config.largeImageText;
const buttons = config.buttons;

DiscordRPC.register(clientId);
const rpc = new DiscordRPC.Client({ transport: 'ipc' });

// Fonction pour mettre à jour le statut Discord avec les images et les boutons
function updateDiscordStatus() {
  const randomImage = images[Math.floor(Math.random() * images.length)];

  rpc.setActivity({
    details: details,
    state: state,
    largeImageKey: randomImage,
    largeImageText: largeImageText,
    buttons: buttons,
    instance: false,
  })
  .catch((error) => {
    console.error('\x1b[31m' +  'Erreur lors de la mise à jour de la présence Discord :', error + '\x1b[0m');
  });
}

// Connectez-vous à DiscordRPC
rpc.login({ clientId })
  .then(() => {
    console.log('\nConnecté à Discord avec succès.' + '\u2714');
    setInterval(updateDiscordStatus, 3000);
  })
  .catch((error) => {
    console.error('\x1b[31m' +  'Erreur lors de la connexion à Discord :', error + '\x1b[0m');
  });
