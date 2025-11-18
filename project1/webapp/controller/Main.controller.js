sap.ui.define([
    "project1/controller/BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
], (BaseController, JSONModel, Filter, FilterOperator) => {
    "use strict";

    return BaseController.extend("project1.controller.Main", {
        onInit() {
            const oBookModel = new JSONModel();
            oBookModel.loadData("model/books/data.json");

            this.getView().setModel(oBookModel, "book");

            const oViewModel = new JSONModel({
                titleQuery: "",
                selectedGenre: "",
                genres: []
            });
            this.setModel(oViewModel, "view");

            oBookModel.attachRequestCompleted(() => {
                this._populateGenreSelect();
            });
        },


        _populateGenreSelect: function () {
            const oBookModel = this.getModel("book");
            const aBooks = oBookModel.getProperty("/Books");

            const genres = [...new Set(aBooks.map(book => book.Genre))];

            const aGenreItems = [{ key: "", text: "All Genres" }];

            genres.forEach(genre => {
                aGenreItems.push({ key: genre, text: genre });
            });

            const oViewModel = this.getModel("view");
            oViewModel.setProperty("/genres", aGenreItems);
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
        onAddRecord: function () {
            const oModel = this.getModel("book")
            const aBooks = oModel.getProperty("/Books")

            aBooks.push({
                ID: "",
                Name: "",
                Author: "",
                Genre: "",
                ReleaseDate: "",
                AvailableQuantity: null
            });

            oModel.setProperty("/Books", aBooks);
        },
        onDeleteRecord: function () {
            const oTable = this.byId("bookList");
            const oModel = this.getModel("book");

            const aSelectedItems = oTable.getSelectedItems();

            if (!aSelectedItems.length) {
                return;
            }

            const aSelectedIDs = aSelectedItems
                .map(item => item.getBindingContext("book"))
                .filter(ctx => !!ctx)
                .map(ctx => ctx.getProperty("ID"));

            if (!aSelectedIDs.length) {
                return;
            }

            const aBooks = oModel.getProperty("/Books").filter(book => {
                return !aSelectedIDs.includes(book.ID);
            });

            oModel.setProperty("/Books", aBooks);
            oTable.removeSelections();
        }
    });
});