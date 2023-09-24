cd ~/hubris-web
git stash
git pull 
echo 'Got latest changes from Github...'
pip install -r requirements.txt
pip install database/pkg/.
echo 'Installed Python dependencies...'
npm install
echo 'Installed Node dependencies...'
npm run build
echo 'Compiled scripts with Vite...'
echo 'Deployment complete.'