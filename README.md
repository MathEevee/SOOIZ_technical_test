*Install NodeJS*

sudo apt-get install nodejs npm
curl -sL https://deb.nodesource.com/setup | sudo bash -
sudo apt-get install -y nodejs

*Mettre a jour nodejs*
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
source ~/.bashrc
nvm install --lts
npm list react-scripts 
npm install 

*pour lancer*
installer les package

*dans le project*
npm install react-chartjs-2 

*lancer, etre dans le dossier 'my_project'*

npm start

*Pour ameliorer la securite*

-Mettre le JSON dans une partie Backend
-Appeler le JSON grace a un fetch

*Pour ameliorer le site*
-refaire le css
