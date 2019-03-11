import { Component, ElementRef, EventEmitter, HostListener, Injectable, Input, NgModule, Output, Pipe, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Observable, Subject, from, noop } from 'rxjs';
import { IonicModule } from '@ionic/angular';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
// searchbar default options
/** @type {?} */
var defaultOpts = {
    cancelButtonText: 'Cancel',
    showCancelButton: false,
    debounce: 250,
    placeholder: 'Search',
    autocomplete: 'off',
    autocorrect: 'off',
    spellcheck: 'off',
    type: 'search',
    value: '',
    noItems: '',
    clearOnEdit: false,
    clearInput: false
};
var AutoCompleteComponent = /** @class */ (function () {
    /**
     * create a new instace
     */
    function AutoCompleteComponent() {
        this.hideListOnSelection = true;
        this.onTouchedCallback = noop;
        this.onChangeCallback = noop;
        this.wasClickedInside = false;
        this.showListChanged = false;
        this.keyword = '';
        this.suggestions = [];
        this._showList = false;
        this.itemSelected = new EventEmitter();
        this.itemsShown = new EventEmitter();
        this.itemsHidden = new EventEmitter();
        this.ionAutoInput = new EventEmitter();
        this.autoFocus = new EventEmitter();
        this.autoBlur = new EventEmitter();
        this.options = {};
        // set default options
        this.defaultOpts = defaultOpts;
    }
    Object.defineProperty(AutoCompleteComponent.prototype, "showList", {
        get: /**
         * @return {?}
         */
        function () {
            return this._showList;
        },
        set: /**
         * @param {?} value
         * @return {?}
         */
        function (value) {
            if (this._showList === value) {
                return;
            }
            this._showList = value;
            this.showListChanged = true;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * handle tap
     * @param event
     */
    /**
     * handle tap
     * @param {?} event
     * @return {?}
     */
    AutoCompleteComponent.prototype.handleTap = /**
     * handle tap
     * @param {?} event
     * @return {?}
     */
    function (event) {
        if (this.showResultsFirst || this.keyword.length > 0) {
            this.getItems();
        }
    };
    /**
     * @param {?} $event
     * @param {?} suggestion
     * @return {?}
     */
    AutoCompleteComponent.prototype.handleSelectTap = /**
     * @param {?} $event
     * @param {?} suggestion
     * @return {?}
     */
    function ($event, suggestion) {
        this.select(suggestion);
        $event.stopPropagation();
        $event.preventDefault();
        return false;
    };
    /**
     * @param {?} value
     * @return {?}
     */
    AutoCompleteComponent.prototype.writeValue = /**
     * @param {?} value
     * @return {?}
     */
    function (value) {
        if (value !== this.selection) {
            this.selection = value || null;
            this.formValue = this.getFormValue(this.selection);
            this.keyword = this.getLabel(this.selection);
        }
    };
    /**
     * @param {?} fn
     * @return {?}
     */
    AutoCompleteComponent.prototype.registerOnChange = /**
     * @param {?} fn
     * @return {?}
     */
    function (fn) {
        this.onChangeCallback = fn;
    };
    /**
     * @param {?} fn
     * @return {?}
     */
    AutoCompleteComponent.prototype.registerOnTouched = /**
     * @param {?} fn
     * @return {?}
     */
    function (fn) {
        this.onTouchedCallback = fn;
    };
    /**
     * @return {?}
     */
    AutoCompleteComponent.prototype.updateModel = /**
     * @return {?}
     */
    function () {
        this.onChangeCallback(this.formValue);
    };
    /**
     * @return {?}
     */
    AutoCompleteComponent.prototype.ngAfterViewChecked = /**
     * @return {?}
     */
    function () {
        if (this.showListChanged) {
            this.showListChanged = false;
            this.showList ? this.itemsShown.emit() : this.itemsHidden.emit();
        }
    };
    /**
     * get items for auto-complete
     */
    /**
     * get items for auto-complete
     * @param {?=} e
     * @return {?}
     */
    AutoCompleteComponent.prototype.getItems = /**
     * get items for auto-complete
     * @param {?=} e
     * @return {?}
     */
    function (e) {
        var _this = this;
        /** @type {?} */
        var result;
        if (this.showResultsFirst && this.keyword.trim() === '') {
            this.keyword = '';
        }
        else if (this.keyword.trim() === '') {
            this.suggestions = [];
            return;
        }
        if (typeof this.dataProvider === 'function') {
            result = this.dataProvider(this.keyword);
        }
        else {
            result = this.dataProvider.getResults(this.keyword);
        }
        // if result is instanceof Subject, use it asObservable
        if (result instanceof Subject) {
            result = result.asObservable();
        }
        if (result instanceof Promise) {
            result = from(result);
        }
        // if query is async
        if (result instanceof Observable) {
            result.subscribe((/**
             * @param {?} results
             * @return {?}
             */
            function (results) {
                _this.suggestions = results;
                _this.showItemList();
            }), (/**
             * @param {?} error
             * @return {?}
             */
            function (error) { return console.error(error); }));
        }
        else {
            this.suggestions = result;
            this.showItemList();
        }
        // emit event
        this.ionAutoInput.emit(this.keyword);
    };
    /**
     * show item list
     */
    /**
     * show item list
     * @return {?}
     */
    AutoCompleteComponent.prototype.showItemList = /**
     * show item list
     * @return {?}
     */
    function () {
        this.showList = true;
    };
    /**
     * hide item list
     */
    /**
     * hide item list
     * @return {?}
     */
    AutoCompleteComponent.prototype.hideItemList = /**
     * hide item list
     * @return {?}
     */
    function () {
        this.showList = this.alwaysShowList;
    };
    /**
     * select item from list
     *
     * @param event
     * @param selection
     **/
    /**
     * select item from list
     *
     * @param {?} selection
     *
     * @return {?}
     */
    AutoCompleteComponent.prototype.select = /**
     * select item from list
     *
     * @param {?} selection
     *
     * @return {?}
     */
    function (selection) {
        this.keyword = this.getLabel(selection);
        this.formValue = this.getFormValue(selection);
        this.hideItemList();
        // emit selection event
        this.updateModel();
        if (this.hideListOnSelection) {
            this.hideItemList();
        }
        // emit selection event
        this.itemSelected.emit(selection);
        this.selection = selection;
    };
    /**
     * get current selection
     * @returns
     */
    /**
     * get current selection
     * @return {?}
     */
    AutoCompleteComponent.prototype.getSelection = /**
     * get current selection
     * @return {?}
     */
    function () {
        return this.selection;
    };
    /**
     * get current input value
     * @returns
     */
    /**
     * get current input value
     * @return {?}
     */
    AutoCompleteComponent.prototype.getValue = /**
     * get current input value
     * @return {?}
     */
    function () {
        return this.formValue;
    };
    /**
     * set current input value
     */
    /**
     * set current input value
     * @param {?} selection
     * @return {?}
     */
    AutoCompleteComponent.prototype.setValue = /**
     * set current input value
     * @param {?} selection
     * @return {?}
     */
    function (selection) {
        this.formValue = this.getFormValue(selection);
        this.keyword = this.getLabel(selection);
        return;
    };
    /**
  
       /**
       * clear current input value
       */
    /**
     * /**
     * clear current input value
     * @param {?=} hideItemList
     * @return {?}
     */
    AutoCompleteComponent.prototype.clearValue = /**
     * /**
     * clear current input value
     * @param {?=} hideItemList
     * @return {?}
     */
    function (hideItemList) {
        if (hideItemList === void 0) { hideItemList = false; }
        this.keyword = '';
        this.selection = null;
        this.formValue = null;
        if (hideItemList) {
            this.hideItemList();
        }
        return;
    };
    /**
     * set focus of searchbar
     */
    /**
     * set focus of searchbar
     * @return {?}
     */
    AutoCompleteComponent.prototype.setFocus = /**
     * set focus of searchbar
     * @return {?}
     */
    function () {
        if (this.searchbarElem) {
            this.searchbarElem.nativeElement.setFocus();
        }
    };
    /**
     * fired when the input focused
     */
    /**
     * fired when the input focused
     * @return {?}
     */
    AutoCompleteComponent.prototype.onFocus = /**
     * fired when the input focused
     * @return {?}
     */
    function () {
        this.autoFocus.emit();
    };
    /**
     * fired when the input focused
     */
    /**
     * fired when the input focused
     * @return {?}
     */
    AutoCompleteComponent.prototype.onBlur = /**
     * fired when the input focused
     * @return {?}
     */
    function () {
        this.autoBlur.emit();
    };
    /**
     * handle document click
     * @param event
     */
    /**
     * handle document click
     * @return {?}
     */
    AutoCompleteComponent.prototype.clickInside = /**
     * handle document click
     * @return {?}
     */
    function () {
        this.wasClickedInside = true;
    };
    /**
     * @return {?}
     */
    AutoCompleteComponent.prototype.clickout = /**
     * @return {?}
     */
    function () {
        if (!this.wasClickedInside) {
            this.hideItemList();
        }
        this.wasClickedInside = false;
    };
    /**
     * @private
     * @param {?} selection
     * @return {?}
     */
    AutoCompleteComponent.prototype.getFormValue = /**
     * @private
     * @param {?} selection
     * @return {?}
     */
    function (selection) {
        if (selection == null) {
            return null;
        }
        /** @type {?} */
        var attr = this.dataProvider.formValueAttribute == null
            ? this.dataProvider.labelAttribute
            : this.dataProvider.formValueAttribute;
        if (typeof selection === 'object' && attr) {
            return selection[attr];
        }
        return selection;
    };
    /**
     * @private
     * @param {?} selection
     * @return {?}
     */
    AutoCompleteComponent.prototype.getLabel = /**
     * @private
     * @param {?} selection
     * @return {?}
     */
    function (selection) {
        if (selection == null) {
            return '';
        }
        /** @type {?} */
        var attr = this.dataProvider.labelAttribute;
        /** @type {?} */
        var value = selection;
        if (this.dataProvider.getItemLabel) {
            value = this.dataProvider.getItemLabel(value);
        }
        if (typeof value === 'object' && attr) {
            return value[attr] || '';
        }
        return value || '';
    };
    AutoCompleteComponent.decorators = [
        { type: Component, args: [{
                    selector: 'ion-auto-complete',
                    template: "\n    <ion-input\n      #inputElem\n      (keyup)=\"getItems($event)\"\n      (click)=\"handleTap($event)\"\n      [(ngModel)]=\"keyword\"\n      (ngModelChange)=\"updateModel()\"\n      [placeholder]=\"options.placeholder == null ? defaultOpts.placeholder : options.placeholder\"\n      [type]=\"options.type == null ? defaultOpts.type : options.type\"\n      [clearOnEdit]=\"options.clearOnEdit == null ? defaultOpts.clearOnEdit : options.clearOnEdit\"\n      [clearInput]=\"options.clearInput == null ? defaultOpts.clearInput : options.clearInput\"\n      [disabled]=\"disabled\"\n      [ngClass]=\"{ hidden: !useIonInput }\"\n      (ionFocus)=\"onFocus()\"\n      (ionBlur)=\"onBlur()\"\n    >\n    </ion-input>\n    <ion-searchbar\n      #searchbarElem\n      (ionInput)=\"getItems($event)\"\n      (click)=\"handleTap($event)\"\n      [(ngModel)]=\"keyword\"\n      (ngModelChange)=\"updateModel()\"\n      [cancelButtonText]=\"options.cancelButtonText == null ? defaultOpts.cancelButtonText : options.cancelButtonText\"\n      [showCancelButton]=\"options.showCancelButton == null ? defaultOpts.showCancelButton : options.showCancelButton\"\n      [debounce]=\"options.debounce == null ? defaultOpts.debounce : options.debounce\"\n      [placeholder]=\"options.placeholder == null ? defaultOpts.placeholder : options.placeholder\"\n      [autocomplete]=\"options.autocomplete == null ? defaultOpts.autocomplete : options.autocomplete\"\n      [autocorrect]=\"options.autocorrect == null ? defaultOpts.autocorrect : options.autocorrect\"\n      [spellcheck]=\"options.spellcheck == null ? defaultOpts.spellcheck : options.spellcheck\"\n      [type]=\"options.type == null ? defaultOpts.type : options.type\"\n      [disabled]=\"disabled\"\n      [ngClass]=\"{ hidden: useIonInput }\"\n      (ionClear)=\"clearValue(true)\"\n      (ionFocus)=\"onFocus()\"\n      (ionBlur)=\"onBlur()\"\n    >\n    </ion-searchbar>\n    <ng-template #defaultTemplate let-attrs=\"attrs\">\n      <span [innerHTML]=\"attrs.label | boldprefix: attrs.keyword\"></span>\n    </ng-template>\n    <ul *ngIf=\"!disabled && suggestions.length > 0 && showList\">\n      <li *ngFor=\"let suggestion of suggestions\" (click)=\"handleSelectTap($event, suggestion)\">\n        <ng-template\n          [ngTemplateOutlet]=\"template || defaultTemplate\"\n          [ngTemplateOutletContext]=\"{\n            attrs: {\n              data: suggestion,\n              label: getLabel(suggestion),\n              keyword: keyword,\n              formValue: getFormValue(suggestion),\n              labelAttribute: dataProvider.labelAttribute,\n              formValueAttribute: dataProvider.formValueAttribute\n            }\n          }\"\n        ></ng-template>\n      </li>\n    </ul>\n    <p *ngIf=\"suggestions.length == 0 && showList && options.noItems\">\n      {{ options.noItems }}\n    </p>\n  ",
                    providers: [
                        {
                            provide: NG_VALUE_ACCESSOR,
                            useExisting: AutoCompleteComponent,
                            multi: true
                        }
                    ]
                },] },
    ];
    /** @nocollapse */
    AutoCompleteComponent.ctorParameters = function () { return []; };
    AutoCompleteComponent.propDecorators = {
        dataProvider: [{ type: Input }],
        options: [{ type: Input }],
        disabled: [{ type: Input }],
        keyword: [{ type: Input }],
        showResultsFirst: [{ type: Input }],
        alwaysShowList: [{ type: Input }],
        hideListOnSelection: [{ type: Input }],
        template: [{ type: Input }],
        useIonInput: [{ type: Input }],
        autoFocus: [{ type: Output }],
        autoBlur: [{ type: Output }],
        itemSelected: [{ type: Output }],
        itemsShown: [{ type: Output }],
        itemsHidden: [{ type: Output }],
        ionAutoInput: [{ type: Output }],
        searchbarElem: [{ type: ViewChild, args: ['searchbarElem', { read: ElementRef },] }],
        inputElem: [{ type: ViewChild, args: ['inputElem',] }],
        clickInside: [{ type: HostListener, args: ['click',] }],
        clickout: [{ type: HostListener, args: ['document:click',] }]
    };
    return AutoCompleteComponent;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * bolds the beggining of the matching string in the item
 */
var BoldPrefix = /** @class */ (function () {
    function BoldPrefix() {
    }
    /**
     * @param {?} value
     * @param {?} keyword
     * @return {?}
     */
    BoldPrefix.prototype.transform = /**
     * @param {?} value
     * @param {?} keyword
     * @return {?}
     */
    function (value, keyword) {
        if (!keyword)
            return value;
        /** @type {?} */
        var escaped_keyword = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        return value.replace(new RegExp(escaped_keyword, 'gi'), (/**
         * @param {?} str
         * @return {?}
         */
        function (str) { return str.bold(); }));
    };
    BoldPrefix.decorators = [
        { type: Pipe, args: [{
                    name: 'boldprefix'
                },] },
        { type: Injectable },
    ];
    return BoldPrefix;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * @record
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
var AutoCompleteModule = /** @class */ (function () {
    function AutoCompleteModule() {
    }
    /**
     * @return {?}
     */
    AutoCompleteModule.forRoot = /**
     * @return {?}
     */
    function () {
        return {
            ngModule: AutoCompleteModule,
            providers: []
        };
    };
    AutoCompleteModule.decorators = [
        { type: NgModule, args: [{
                    imports: [CommonModule, FormsModule, IonicModule],
                    declarations: [AutoCompleteComponent, BoldPrefix],
                    exports: [AutoCompleteComponent, BoldPrefix]
                },] },
    ];
    return AutoCompleteModule;
}());

export { AutoCompleteModule, AutoCompleteComponent, BoldPrefix };
