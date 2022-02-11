const dropZone = document.querySelector('.drop-zone');
const iconContainer = document.querySelector('.icon-container');
const browseFile = document.querySelector('#browseFile')
const browseBtn = document.querySelector('.browseBtn');
const progressContainer = document.querySelector('.progress-container')
const percentDiv = document.querySelector('#percent')
const bgProgress = document.querySelector('.bg-progress');
const progressBar = document.querySelector('.progress-bar');
const fileURL = document.querySelector('#fileURL')
const sharingContainer = document.querySelector('.sharing-container');
const copyBtn = document.querySelector('.copyBtn');
const emailForm = document.querySelector('#emailForm');
const toast = document.querySelector('.toast');
const theme = document.querySelector('#theme');

// at every reload
window.onload = () => {
    document.body.className = localStorage.preferredMode === undefined ? "" : localStorage.preferredMode;

    theme.innerText = localStorage.icon === undefined ? "🌞" : localStorage.icon;
}

// theme change
theme.addEventListener('click', () => {
    theme.classList.toggle('theme');
    if (theme.classList.contains('theme')) {
        theme.innerText = '🌛';
        document.body.classList.add('dark');
        // local storage
        localStorage.icon = '🌛'
        localStorage.preferredMode = "dark";
    } else {
        theme.innerText = '🌞';
        document.body.classList.remove('dark');
        // local storage
        localStorage.icon = '🌞'
        localStorage.preferredMode = "light";
    }

})





// host 
const host = "https://sharemefile.herokuapp.com/"
const uploadURL = `${host}api/files`;
const emailURL = `${host}api/files/send`;


dropZone.addEventListener('dragover', (e) => {
    // console.log('dropping')
    e.preventDefault();
    if (!dropZone.classList.contains('dragged')) {
        dropZone.classList.add('dragged')
    }
})

// cancel the class dragged when we leave drag
dropZone.addEventListener('dragleave', () => {
    dropZone.classList.remove('dragged');
})

dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('dragged');
    const files = e.dataTransfer.files;
    if (files.length) {
        browseFile.files = files
        uploadFile()
    }
})

browseFile.addEventListener('change', () => {
    uploadFile()
})

browseBtn.addEventListener('click', () => {
    browseFile.click();
})

// copy button
copyBtn.addEventListener('click', () => {
    fileURL.select();
    fileURL.setSelectionRange(0, 99999); /* For mobile devices */
    /* Copy the text inside the text field */
    navigator.clipboard.writeText(fileURL.value);
    showToast("Link copied");
})
// max allowed size:
const maxAllowedSize = 100 * 1024 * 1024; //100mb
const uploadFile = () => {

    if (browseFile.files.length > 1) {
        resetBrowseFile()
        showToast("Only upload 1 file!");
        return;
    }
    const file = browseFile.files[0];
    if (file.size > maxAllowedSize) {
        showToast("Can't upload more than 100MB size")
        resetBrowseFile();
        return;
    }
    progressContainer.style.display = 'block';
    const formData = new FormData()
    formData.append("myFile", file);
    const xhr = new XMLHttpRequest();
    // holds the status of the XMLHttpRequest
    xhr.onreadystatechange = () => {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            onUploadSuccess(JSON.parse(xhr.response));
        }
    }
    // progress
    xhr.upload.onprogress = updateProgress;
    xhr.upload.onerror = () => {
        resetBrowseFile()
        showToast(`Error in Uploading : ${xhr.statusText}`);
    }
    xhr.open('post', uploadURL);
    xhr.send(formData)
}

const resetBrowseFile = () => {
    browseFile.value = "";
}

const updateProgress = (e) => {
    const percent = Math.round((e.loaded / e.total) * 100);
    bgProgress.style.width = `${percent}px`
    percentDiv.innerText = percent;
    progressBar.style.transform = `scaleX(${percent / 100})`
}

const onUploadSuccess = ({ file: url }) => {
    emailForm[2].removeAttribute('disable');
    resetBrowseFile()
    progressContainer.style.display = 'none';
    sharingContainer.style.display = 'block';
    fileURL.value = url;
}

emailForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const url = fileURL.value;
    const formData = {
        uuid: url.split("/").splice(-1, 1)[0],
        emailTo: emailForm.elements["to-email"].value,
        emailFrom: emailForm.elements["from-email"].value
    }
    emailForm[2].setAttribute('disable', 'true');
    fetch(emailURL, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        }, body: JSON.stringify(formData)
    }).then((res) => res.json()).then(({ success }) => {
        if (success) {
            sharingContainer.style.display = 'none';
            showToast('Email sent');
        }
    }).catch(err => console.log(err))
})
let toastTimer;
const showToast = (msg) => {
    toast.style.display = 'block';
    toast.innerHTML = msg;
    toast.style.transform = `translate(-50%,0)`
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
        toast.style.transform = `translate(-50%,60px)`
        toast.style.display = 'none';
    }, 2000);
}