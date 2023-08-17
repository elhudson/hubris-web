echo 'Logged onto production server...'
cd ~/hubris-web
git pull 
echo 'Got latest changes from Github...'
pip install -r requirements.txt
pip install database/pkg/.
echo 'Installed Python dependencies...'
npm install
echo 'Installed Node dependencies...'
npm run build
echo 'Compiled scripts with Webpack...'
echo 'Deployment complete.'