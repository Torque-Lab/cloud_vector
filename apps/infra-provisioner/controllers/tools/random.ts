export function generateRandomString() {
  return Math.floor(Math.random() * 1000000).toString();
}

export function generatePassword(){
const options="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
let password="";
for(let i=0;i<18;i++){
    const randomIndex=Math.floor(Math.random() * options.length);
    password+=options[randomIndex];
}
return password;
    
}
    
