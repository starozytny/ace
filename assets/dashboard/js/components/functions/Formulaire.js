const axios       = require("axios");
const toastr      = require("toastr");
const Swal        = require("sweetalert2");
const SwalOptions = require("@dashboardComponents/functions/swalOptions");
const UpdateList  = require("@dashboardComponents/functions/updateList");

function axiosGetData(self, url, sorter = null){
    axios.get(url, {})
        .then(function (response) {
            let data = response.data;
            if(sorter !== null){
                data.sort(sorter);
            }
            self.setState({ data: data });
        })
        .catch(function () {
            self.setState({ loadPageError: true });
        })
        .then(function () {
            self.setState({ loadData: false });
        })
    ;
}

function axiosGetDataPagination(self, url, sorter = null, perPage=10){
    axios.get(url, {})
        .then(function (response) {
            let data = response.data;
            if(sorter !== null){
                data.sort(sorter);
            }
            self.setState({ dataImmuable: data, data: data, currentData: data.slice(0, perPage) });
        })
        .catch(function (error) {
            self.setState({ loadPageError: true });
        })
        .then(function () {
            self.setState({ loadData: false });
        })
    ;
}

function updateData(self, sorter, newContext, context, data, element){
    let nContext = (newContext !== null) ? newContext : context;
    let newData = UpdateList.update(nContext, data, element);
    newData.sort(sorter)

    self.setState({
        data: newData,
        element: element
    })
}

function updateDataPagination(self, sorter, newContext, context, data, element, perPage=10){
    let nContext = (newContext !== null) ? newContext : context;
    let newData = UpdateList.update(nContext, data, element);
    newData.sort(sorter)

    self.setState({
        dataImmuable: newData,
        data: newData,
        currentData: newData.slice(0,perPage),
        element: element
    })
}

function displayErrors(self, error, message="Veuillez vérifier les informations transmises."){
    if(Array.isArray(error.response.data)){
        toastr.error(message);
        self.setState({ errors: error.response.data });
    }else{
        if(error.response.data.message){
            toastr.error(error.response.data.message)
        }else{
            toastr.error(message);
        }
    }
}

function deleteElement(self, element, url, showLoader = true, showFire = true)
{
    if(showLoader){
        loader(true);
    }
    axios.delete(url, {})
        .then(function (response) {
            if(showFire){
                Swal.fire(response.data.message, '', 'success');
            }
            self.handleUpdateList(element, "delete");
        })
        .catch(function (error) {
            console.log(error)
            displayErrors(self, error, "Une erreur est survenue, veuillez contacter le support.")
        })
        .then(() => {
            loader(false);
        })
    ;
}

function axiosDeleteElement(self, element, url, title, text, showLoader = true, showFire = false){
    Swal.fire(SwalOptions.options(title, text))
        .then((result) => {
            if (result.isConfirmed) {
                deleteElement(self, element, url, showLoader, showFire);
            }
        })
    ;
}

function axiosDeleteGroupElement(self, checked, url,
                                 txtEmpty="Aucun élément sélectionné.",
                                 title="Supprimer la sélection ?",
                                 text="Cette action est irréversible.",
                                 showLoader = true,
                                 showFire = false){
    let selectors = []
    checked.forEach(el => {
        selectors.push(parseInt(el.value))
    })

    if(selectors.length === 0){
        toastr.info(txtEmpty);
    }else{
        Swal.fire(SwalOptions.options(title, text))
            .then((result) => {
                if (result.isConfirmed) {

                    if(showLoader){
                        loader(true);
                    }
                    axios({ method: "delete", url: url, data: selectors })
                        .then(function (response) {
                            if(showFire){
                                Swal.fire(response.data.message, '', 'success');
                            }
                            self.handleUpdateList(selectors, "delete_group");
                        })
                        .catch(function (error) {
                            displayErrors(self, error, "Une erreur est survenue, veuillez contacter le support.")
                        })
                        .then(() => {
                            loader(false);
                        })
                    ;
                }
            })
        ;
    }
}

function loader(status){
    let loader = document.querySelector('#loader');
    if(status){
        loader.style.display = "flex";
    }else{
        loader.style.display = "none";
    }
}

function isSeen (self, element, url){
    if(!element.isSeen){
        axios.post(url, {})
            .then(function (response) {
                let data = response.data;
                self.handleUpdateList(data, 'update');
            })
            .catch(function (error) {
                displayErrors(self, error)
            })
        ;
    }
}

module.exports = {
    loader,
    displayErrors,
    axiosGetData,
    axiosGetDataPagination,
    axiosDeleteElement,
    axiosDeleteGroupElement,
    updateData,
    updateDataPagination,
    deleteElement,
    isSeen
}