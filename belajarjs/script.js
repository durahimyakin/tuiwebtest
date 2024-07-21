function ioOpenModal(modalId, state){

    var modal = document.getElementById(modalId);

    console.log('console 1', state);

    // kalo state ada isi nya
    if(typeof state !== 'undefined' && state){
        modal.style.display = state;

        return 1;
    }

    console.log('console 2', state);

    // kalo state gak ada isinya, makan jalanin yang ini
    if(modal.style.display !== 'block'){
        modal.style.display = 'block';
    }
    else{
        modal.style.display = 'none';
    }
}
