<script lang="ts">
    let selectedImage = null;

    function handleImageUpload(event: Event) {
        const file = (event.target as HTMLInputElement)?.files?.[0];
        const reader = new FileReader();

        reader.onload = () => {
            selectedImage = reader.result as string;
            const profilePhoto = document.getElementById('profile_photo');
            if (profilePhoto) {
                profilePhoto.style.backgroundImage = `url(${selectedImage})`;
                profilePhoto.style.borderRadius = '50%';
            }
        };

        reader.readAsDataURL(file);
    }


</script>

<input type="file" accept="image/*" on:input={handleImageUpload} />
<div id="profile_photo"></div>