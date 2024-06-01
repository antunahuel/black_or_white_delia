let uploadImage = document.getElementById("uploadImage");
uploadImage.addEventListener("submit", async (event) => {
    try {
        event.preventDefault();
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        const raw = JSON.stringify({
            "urlImage": image.value
        });

        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow"
        };

        let response = await fetch("/api/image/upload", requestOptions);

        if(response.status == 200){
            let data = await response.json();
            alert(data.msg);
            uploadImage.reset();
        }else{
            throw new Error("Se ha producido un error al cargar imagen")
        }
    } catch (error) {
        console.log(error);
        alert("Se ha producido un error al cargar imagen")
    }

})