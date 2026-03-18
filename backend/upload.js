function handleFileSelect(event) {
    const file = event.target.files[0];
    if (file) {
        // Validate file type and size
        if (!file.type.startsWith('image/')) {
            showToast('Please select an image file!', 'error');
            return;
        }
        
        if (file.size > 10 * 1024 * 1024) { // 10MB limit
            showToast('File size must be less than 10MB!', 'error');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = function(e) {
            uploadedImageData = e.target.result;
            
            // Update upload area
            const uploadArea = document.querySelector('.upload-area');
            uploadArea.classList.add('has-file');
            document.getElementById('uploadText').textContent = `Selected: ${file.name}`;
            
            // Show preview
            const preview = document.getElementById('imagePreview');
            preview.innerHTML = `<img src="${uploadedImageData}" class="preview-image" alt="Preview">`;
            
            // Enable generate button
            document.getElementById('generateBtn').disabled = false;
            
            showToast('Image uploaded successfully!');
        };
        reader.readAsDataURL(file);
    }
}
