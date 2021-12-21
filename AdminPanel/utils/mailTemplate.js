module.exports.passwordTemplate = (password)=>{
    const s=
    `<h1>Welcome to OWL</h1>
    <p>Your Temporary Password is : <b>${password}</b></p>
    <img src="https://res.cloudinary.com/kongkacloud/image/upload/v1640079192/kads_r424kw.png" alt="logo">`;
    return s;
}