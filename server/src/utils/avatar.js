function assignRandomAvatar() {
    const avatarUrls = [
        "https://api.multiavatar.com/stefan.svg",
        "https://api.multiavatar.com/kathrin.svg",
        "https://api.multiavatar.com/zoe.svg"
    ];

    const randomIndex = Math.floor(Math.random() * avatarUrls.length);
    return avatarUrls[randomIndex];
}
function generateUsername(firstName, lastName, email) {
    const emailPrefix = email.split("@")[0];
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);

    const options = [
        `${firstName.toLowerCase()}_${lastName.toLowerCase()}`,
        `${firstName.toLowerCase()}${lastName.charAt(0).toLowerCase()}`,
        `${emailPrefix.toLowerCase()}`,
        `${firstName.toLowerCase()}${randomSuffix}`
    ];

    const randomIndex = Math.floor(Math.random() * options.length);
    return options[randomIndex];
}

module.exports = {
    assignRandomAvatar,generateUsername
};