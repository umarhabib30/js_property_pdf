
// Handle single image upload
function handleImageUpload(input, previewId) {
    const file = input.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const previewDiv = document.getElementById(previewId);
            const placeholderDiv = document.getElementById(
                previewId.replace("-preview", "-upload-placeholder")
            );
            const img = previewDiv.querySelector("img");

            img.src = e.target.result;
            placeholderDiv.classList.add("hidden");
            previewDiv.classList.remove("hidden");
        };
        reader.readAsDataURL(file);
    }
}

// Handle multiple image upload
function handleMultiImageUpload(input) {
    const files = Array.from(input.files);
    if (files.length > 0) {
        const previewDiv = document.getElementById("multi-preview");
        const placeholderDiv = document.getElementById(
            "multi-upload-placeholder"
        );
        const container = document.getElementById("multi-image-container");

        // Clear existing previews
        container.innerHTML = "";

        files.forEach((file, index) => {
            const reader = new FileReader();
            reader.onload = function (e) {
                const imageWrapper = document.createElement("div");
                imageWrapper.className = "relative";
                imageWrapper.innerHTML = `
                <img src="${e.target.result}" class="image-preview-small w-full" />
                <button type="button" class="remove-image" onclick="removeMultiImage(${index})">×</button>
              `;
                container.appendChild(imageWrapper);
            };
            reader.readAsDataURL(file);
        });

        placeholderDiv.classList.add("hidden");
        previewDiv.classList.remove("hidden");
    }
}

// Remove single image
function removeImage(inputId, previewId) {
    const input = document.getElementById(inputId);
    const previewDiv = document.getElementById(previewId);
    const placeholderDiv = document.getElementById(
        previewId.replace("-preview", "-upload-placeholder")
    );

    input.value = "";
    previewDiv.classList.add("hidden");
    placeholderDiv.classList.remove("hidden");
}

// Remove image from multi-upload
function removeMultiImage(index) {
    const input = document.getElementById("multi_images");
    const dt = new DataTransfer();
    const files = Array.from(input.files);

    files.forEach((file, i) => {
        if (i !== index) {
            dt.items.add(file);
        }
    });

    input.files = dt.files;

    if (input.files.length === 0) {
        const previewDiv = document.getElementById("multi-preview");
        const placeholderDiv = document.getElementById(
            "multi-upload-placeholder"
        );
        previewDiv.classList.add("hidden");
        placeholderDiv.classList.remove("hidden");
    } else {
        handleMultiImageUpload(input);
    }
}
