import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertType } from '@fuse/components/alert';
import { AuthService } from 'app/core/auth/auth.service';
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
    selector     : 'auth-sign-in',
    templateUrl  : './sign-in.component.html',
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class AuthSignInComponent implements OnInit
{
    @ViewChild('signInNgForm') signInNgForm: NgForm;

    webSocket: any;
    alert: { type: FuseAlertType; message: string } = {
        type   : 'success',
        message: ''
    };
    showLoaderAuth = false;
    signInForm: UntypedFormGroup;
    showAlert: boolean = false;
    connection: boolean = false;
    authCert: any;
    fullname: any;

    /**
     * Constructor
     */
    constructor(
        private _activatedRoute: ActivatedRoute,
        private _authService: AuthService,
        private _formBuilder: UntypedFormBuilder,
        private _router: Router,
        private _snackBar: MatSnackBar
    )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        // Create the form
        this.signInForm = this._formBuilder.group({
            username     : ['test', Validators.required],
            password  : ['123', Validators.required],
            rememberMe: ['']
        });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Sign in
     */
    signIn(): void
    {
        // Return if the form is invalid
        if ( this.signInForm.invalid )
        {
            return;
        }

        // Disable the form
        this.signInForm.disable();

        // Hide the alert
        this.showAlert = false;

        // Sign in
        this._authService.signIn(this.signInForm.value)
            .subscribe(
                (response) => {

                    // Set the redirect url.
                    // The '/signed-in-redirect' is a dummy url to catch the request and redirect the user
                    // to the correct page after a successful sign in. This way, that url can be set via
                    // routing file and we don't have to touch here.
                    const redirectURL = this._activatedRoute.snapshot.queryParamMap.get('redirectURL') || '/signed-in-redirect';
                    // Navigate to the redirect url
                    this._router.navigateByUrl(redirectURL);

                },
                (response) => {

                    // Re-enable the form
                    this.signInForm.enable();

                    // Reset the form
                    this.signInNgForm.resetForm();

                    // Set the alert
                    this.alert = {
                        type   : 'error',
                        message: 'Wrong username or password'
                    };

                    // Show the alert
                    this.showAlert = true;
                }
            );
    }

    signInWithKey() {
        this.webSocket = new WebSocket('wss://127.0.0.1:13579/');
        this.webSocket.onopen = (event: any) => {
            this.connection = true;
            const createCAdESFromBase64 = {
                module: 'kz.gov.pki.knca.commonUtils',
                method: 'getKeyInfo',
                args: ['PKCS12']
            };
            this.webSocket.send(JSON.stringify(createCAdESFromBase64));
        };
        this.webSocket.onclose = (event: any) => {
        };

        this.webSocket.onerror = (event: any) => {
            if (event.type === 'error') {
                this.signInForm.enable()
                this._snackBar.open('Ошибка подключения к NCALayer', 'Ок', {duration: 3000, panelClass: ["snack-bar"]});
            }
        };

        this.webSocket.onmessage = (event: any) => {
            const data = JSON.parse(event.data);
            if (data.responseObject) {
                this.showLoaderAuth = true;
                let cert = data.responseObject.pem.replace('-----BEGIN CERTIFICATE-----', '');
                cert = cert.replace('-----END CERTIFICATE-----', '');
                this.authCert = cert.replace(/\s/g, '');
                console.log(this.authCert)
                this._authService.signInWithKey(this.authCert)
                    .subscribe(
                        () => {

                            // Set the redirect url.
                            // The '/signed-in-redirect' is a dummy url to catch the request and redirect the user
                            // to the correct page after a successful sign in. This way, that url can be set via
                            // routing file and we don't have to touch here.
                            const redirectURL = this._activatedRoute.snapshot.queryParamMap.get('redirectURL') || '/signed-in-redirect';

                            // Navigate to the redirect url
                            this._router.navigateByUrl(redirectURL);

                        },
                        (response) => {

                            // Re-enable the form
                            this.signInForm.enable();

                            // Reset the form
                            this.signInNgForm.resetForm();

                            // Set the alert
                            this.alert = {
                                type   : 'error',
                                message: 'Неправильный ЭЦП'
                            };

                            // Show the alert
                            this.showAlert = true;
                        }
                    );

            }
        };
    }
}
