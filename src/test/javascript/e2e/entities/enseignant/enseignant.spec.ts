import { browser, ExpectedConditions as ec, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { EnseignantComponentsPage, EnseignantDeleteDialog, EnseignantUpdatePage } from './enseignant.page-object';

const expect = chai.expect;

describe('Enseignant e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let enseignantComponentsPage: EnseignantComponentsPage;
  let enseignantUpdatePage: EnseignantUpdatePage;
  let enseignantDeleteDialog: EnseignantDeleteDialog;
  const username = process.env.E2E_USERNAME ?? 'admin';
  const password = process.env.E2E_PASSWORD ?? 'admin';

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing(username, password);
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load Enseignants', async () => {
    await navBarPage.goToEntity('enseignant');
    enseignantComponentsPage = new EnseignantComponentsPage();
    await browser.wait(ec.visibilityOf(enseignantComponentsPage.title), 5000);
    expect(await enseignantComponentsPage.getTitle()).to.eq('Enseignants');
    await browser.wait(ec.or(ec.visibilityOf(enseignantComponentsPage.entities), ec.visibilityOf(enseignantComponentsPage.noResult)), 1000);
  });

  it('should load create Enseignant page', async () => {
    await enseignantComponentsPage.clickOnCreateButton();
    enseignantUpdatePage = new EnseignantUpdatePage();
    expect(await enseignantUpdatePage.getPageTitle()).to.eq('Create or edit a Enseignant');
    await enseignantUpdatePage.cancel();
  });

  it('should create and save Enseignants', async () => {
    const nbButtonsBeforeCreate = await enseignantComponentsPage.countDeleteButtons();

    await enseignantComponentsPage.clickOnCreateButton();

    await promise.all([
      enseignantUpdatePage.setMatriculeEnsInput('matriculeEns'),
      enseignantUpdatePage.setNomPrenomInput('nomPrenom'),
      enseignantUpdatePage.sexeSelectLastOption(),
      enseignantUpdatePage.setTelephoneInput('telephone'),
      enseignantUpdatePage.setMailInput('mail'),
      enseignantUpdatePage.setGradeInput('grade'),
      enseignantUpdatePage.optionSelectLastOption(),
      enseignantUpdatePage.situationMatrimonialeSelectLastOption(),
      enseignantUpdatePage.statusSelectLastOption(),
      enseignantUpdatePage.setFonctionInput('fonction'),
      enseignantUpdatePage.lyceesTechniquesSelectLastOption(),
      enseignantUpdatePage.serieSelectLastOption(),
      enseignantUpdatePage.filiereSelectLastOption(),
      enseignantUpdatePage.proviseurSelectLastOption(),
    ]);

    await enseignantUpdatePage.save();
    expect(await enseignantUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

    expect(await enseignantComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1, 'Expected one more entry in the table');
  });

  it('should delete last Enseignant', async () => {
    const nbButtonsBeforeDelete = await enseignantComponentsPage.countDeleteButtons();
    await enseignantComponentsPage.clickOnLastDeleteButton();

    enseignantDeleteDialog = new EnseignantDeleteDialog();
    expect(await enseignantDeleteDialog.getDialogTitle()).to.eq('Are you sure you want to delete this Enseignant?');
    await enseignantDeleteDialog.clickOnConfirmButton();
    await browser.wait(ec.visibilityOf(enseignantComponentsPage.title), 5000);

    expect(await enseignantComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
