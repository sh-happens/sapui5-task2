sap.ui.define([
    "project1/controller/BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
], (BaseController, JSONModel, Filter, FilterOperator) => {
    "use strict";

    return BaseController.extend("project1.controller.Main", {
        onInit() {
            const oViewModel = new JSONModel({
                titleQuery: "",
                selectedGenre: "",
                genres: []
            });

            this.setModel(oViewModel, "view");
            this._populateGenreSelect();
        },

        _populateGenreSelect: function () {
            const oBookModel = this.getModel("book");
            console.log("oBookModel: ",oBookModel)
            const aBooks = oBookModel.getProperty("/Books");

            const genres = [...new Set(aBooks.map(book => book.Genre))];

            const oViewModel = this.getModel("view");
            oViewModel.setProperty("/genres", genres);

            const oSelect = this.byId("genreFilter");

            oSelect.removeAllItems();
            oSelect.addItem(new sap.ui.core.Item({
                key: "",
                text: "All Genres"
            }));

            genres.forEach(genre => {
                oSelect.addItem(new sap.ui.core.Item({
                    key: genre,
                    text: genre
                }));
            });
        },

        onApplyFilters: function () {
            const oViewModel = this.getModel("view");

            const sTitle = oViewModel.getProperty("/titleQuery");
            const sGenre = oViewModel.getProperty("/selectedGenre");

            const aFilters = [];

            if (sTitle) {
                aFilters.push(new Filter("Name", FilterOperator.Contains, sTitle));
            }
            if (sGenre) {
                aFilters.push(new Filter("Genre", FilterOperator.EQ, sGenre));
            }

            const oTable = this.byId("bookList");
            oTable.getBinding("items").filter(aFilters);
        },
        onGenreChange: function () {
            this.onApplyFilters();
        },
        onAddRecord: function () {
            const oModel = this.getModel("book")
            const aBooks = oModel.getProperty("/Books")
            console.log('abooks: ', aBooks)


            aBooks.push({
                ID: "",
                Name: "",
                Author: "",
                Genre: "",
                ReleaseDate: "",
                AvailableQuantity: null
            });

            oModel.setProperty("/Books", aBooks);
            oModel.refresh(true);
        },
        onDeleteRecord: function () {
            const oTable = this.byId("bookList");
            const oModel = this.getModel("book");

            const aSelectedContexts = oTable.getSelectedContexts("book");
            const aBooks = oModel.getProperty("/Books");

            const aIndices = aSelectedContexts.map(item => {
                return parseInt(item.getPath().split("/").pop(), 10);
            });

            aIndices.sort((a, b) => b - a);

            aIndices.forEach(index => {
                aBooks.splice(index, 1);
            });

            oModel.setProperty("/Books", aBooks);
            oModel.refresh(true);

            oTable.removeSelections();
        }


    });
});