
const videoData = document.querySelector('video');
var isCheckBoxVal = document.getElementById('isCheckBoxVal');
var changeText = document.getElementById('changeText');
var showVideo = document.getElementById('showVideo');
const textExtractFromImage = document.querySelector('[data-text]');

async function init(isCamera) {
    // Get the camera stream in the video tag

    const liveVideo = await navigator.mediaDevices.getUserMedia({ video: isCamera });
    videoData.srcObject = liveVideo;
    isCheckBoxVal.checked = isCamera;
    changeDataCommon(isCamera);
    videoData.addEventListener('playing' ,async()=>{
        const tesseractWorker = Tesseract.createWorker();
        await tesseractWorker.load();
        await tesseractWorker.loadLanguage('eng');
        await tesseractWorker.initialize('eng');


        const canvas = document.createElement('canvas');
        canvas.width = videoData.width;
        canvas.height = videoData.height;

        document.addEventListener('keypress',async keyName => {
            if(keyName.code !== 'KeyA') return
                const context = canvas.getContext('2d');
                context.drawImage(videoData, 0, 0, videoData.width, videoData.height);
                const { data: { text } } = await tesseractWorker.recognize(canvas);
                console.log(text);
                textExtractFromImage.textContent = text;

                speechSynthesis.speak(new SpeechSynthesisUtterance(text.replace(/\s/g," "))); //White space RegEx
        });
 
        

    });
};




function validate() {
    isCheckBoxVal.checked ? changeDataCommon(true):changeDataCommon(false);
}

function changeDataCommon(valueBool){
    changeText.innerHTML = valueBool ? "Toggle the switch to stop the video": "Toggle the switch to stop the video";
    showVideo.style.display = valueBool ? 'flex': "none";
}




init(true);