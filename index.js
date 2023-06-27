const request = require('request');
const fs = require('fs');
const path = require('path');

const packageJsonUrl = "https://api.github.com/repos/Az-png/Extaz-rpc/contents/package.json";
const indexJsUrl = "https://api.github.com/repos/Az-png/Extaz-rpc/contents/index.js";
const packageJsonPath = path.join(__dirname, 'package.json');
const indexJsPath = path.join(__dirname, 'index.js');

// Vérifier et télécharger les mises à jour
function checkForUpdates() {
  console.log("\nVérification des mises à jour...");

  request({
    url: packageJsonUrl,
    headers: {
      'User-Agent': 'Az-png'
    },
  }, (error, response, body) => {
    if (error) {
      console.error("\nUne erreur s'est produite lors de la vérification des mises à jour :", error);
      return;
    }

    if (response.statusCode !== 200) {
      console.error("\nLa requête de vérification des mises à jour a retourné une réponse non valide :", response.statusCode);
      return;
    }

    const packageJsonData = JSON.parse(body);

    fs.readFile(packageJsonPath, 'utf-8', (err, data) => {
      if (err) {
        console.error("\nUne erreur s'est produite lors de la lecture du fichier package.json :", err);
        return;
      }

      const currentPackageJson = JSON.parse(data);

      if (currentPackageJson.version !== packageJsonData.version) {
        console.log("\nUne nouvelle version est disponible. Téléchargement en cours...");

        request({
          url: indexJsUrl,
          headers: {
            'User-Agent': 'Az-png'
          },
        }, (err, res, body) => {
          if (err) {
            console.error("\nUne erreur s'est produite lors du téléchargement de la mise à jour :", err);
            return;
          }

          if (res.statusCode !== 200) {
            console.error("\nLa requête de téléchargement de la mise à jour a retourné une réponse non valide :", res.statusCode);
            return;
          }

          const indexJsData = JSON.parse(body);

          fs.writeFile(indexJsPath, Buffer.from(indexJsData.content, 'base64').toString('utf-8'), 'utf-8', (error) => {
            if (error) {
              console.error("\nUne erreur s'est produite lors de l'écriture du fichier index.js :", error);
              return;
            }

            console.log("\nMise à jour effectuée avec succès. Redémarrez le script.");
            process.exit();
          });
        });
      } else {
        console.log("\nLe script est à jour. Aucune mise à jour disponible.");
      }
    });
  });
}

// Appeler la fonction de vérification des mises à jour
checkForUpdates();
