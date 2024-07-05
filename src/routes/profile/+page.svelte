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

<div class="max-w-md mx-auto mt-10 bg-white p-6 rounded shadow-md">
    <h1 class="text-2xl font-bold mb-4">Your profile!</h1>
    <div class="mt-2 ml-6">
        <p>Upload a profile picture!</p>
        <input type="file" accept="image/*" on:input={handleImageUpload} />
        <div id="profile_photo"></div>
    </div>
    <div class="m-6">
        <p>Change password:</p>
        <form action="/reset-password" class="bg-blue-500 text-white py-2 px-4 rounded mr-48">
            <button type="submit">Change Password</button>
        </form>
    </div>
</div>
