---
title: Gestion token
order: 11
category:
  - Guide
---

# Gestion des tokens

Cette partie est indispensable pour faire fonctionner l'application, car la quasi-totalité des requête demande un token d'autorisation. Ce token permet de savoir si l'utilisateur est authentifié ou non.

## Le token d'autorisation et le refresh token

L'API de MyECL suis les conventions, il s'agit donc d'un token de type Bearer. Ce token doit être mis dans le header de chaque requête. ce token est valide pendant 30 min. Au-delà de ce delai il faut renouveler le token, grâce à au refresh token.
Ainsi, l'API n'envoie pas un token mais une paire, le token et le refresh token.
L'application sauvegarde uniquement le refresh token dans un fichier, de sorte qu'au prochain lancement de l'application, le token d'autorisation sera automatiquement renouvelé. Si la procédure échoue, principalement si le refresh token est expiré, ou inexistant (à la première connection par exemple), l'application demande à l'utilisateur de se reconnecter, pour générer une nouvelle paire de token.

## Rafraichissement du token d'authorisation

Le dossier _auth_ contient les fonctions permettant de gérer le token d'autorisation, mais vous n'aurez jamais à vous servir de ces fonctions directement. Cependant, vous aurez forcément besoin de récupérer le token d'autorisation pour chaque requête. Il est stocké dans un Provider nommé `tokenProvider` :

```dart
final token = ref.watch(tokenProvider);
```

Il n'existe que deux cas de figure pour que l'application se rende compte que le token est expiré :

- Le pull-to-refresh : Ici, l'utilisateur souhaite rafraichir la page, l'application redemande donc à l'API les données, et cela peut échouer à cause de l'expiration. Ce cas de figure est totalement géré par le `Refresher`. Cette classe fait partie des nombreuses classe que je vous incite à utiliser dans vos modules, pour gagner du temps et éviter d'avoir des erreurs que j'ai déjà résolues.
- Un bouton : Ici, votre module fournit un bouton, qui communique indirectement avec l'API, par exemple pour ajouter un prêt. Dans ce cas, c'est à vous d'inclure l'outil de rafraichissement du token dans votre fonction. Il faut encapsuler votre fonction du provider dans la fonction `tokenExpireWrapper` (dans _tools/token_expire_wrapper.dart_), qui rafraîchit le token si besoin est. Pour empêcher l'utilisateur de cliquer plusieurs fois sur le bouton, implémentez un `WaitingButton` (dans _tools/ui/shrink_button.dart_)

    Exemple dans _loan/ui/pages/item_group_page/add_edit_item_page.dart_ :

    ```dart
    if (key.currentState == null) {
    	return;
    }
      if (key.currentState!.validate()) {
      	await tokenExpireWrapper(ref, () async {
        	Item newItem = Item(
          	id: isEdit ? item.id : '',
            name: name.text,
            caution: int.parse(caution.text),
            suggestedLendingDuration:
            double.parse(lendingDuration.text),
            available: item.available);
          final value = isEdit
          	? await itemListNotifier.updateItem(
            	newItem, loaner.id)
            : await itemListNotifier.addItem(
            	newItem, loaner.id);
          ...
          }
        });
      } else {
      	displayToast(context, TypeMsg.error,
        	LoanTextConstants.incorrectOrMissingFields);
      }
    ```

Voici le code du wrapper dans _tools/token_expire_wrapper.dart_ :

```dart
Future tokenExpireWrapper(WidgetRef ref, Future<dynamic> Function() f) async {
  await f().catchError((error, stackTrace) async {
    final tokenNotifier = ref.watch(authTokenProvider.notifier);
    final askingRefreshTokenNotifier =
        ref.watch(askingRefreshTokenProvider.notifier);
    final askingRefreshToken = ref.watch(askingRefreshTokenProvider);
    if (error is AppException && error.type == ErrorType.tokenExpire) {
      if (askingRefreshToken) return;
      askingRefreshTokenNotifier.setbool(true);
      try {
        final value = await tokenNotifier.refreshToken();
        if (value) {
          f();
        } else {
          tokenNotifier.deleteToken();
        }
      } catch (e) {
        tokenNotifier.deleteToken();
      }
      askingRefreshTokenNotifier.setbool(false);
    }
  });
}
```

Son but est de repérer précisément si l'erreur est due à l'expiration du token, et, si besoin est, de le rafraichir, puis de relancer la fonction.

Ce code recherche précisemment une erreur de type AppException, et si c'est le cas, il vérifie si l'erreur est due à l'expiration du token. Si c'est le cas, il appelle la fonction de rafraichissement du token. Si cette dernière réussie, tokenExpireWrapper relance la fonction. Sinon, elle renvoie à la page de connexion.

Le provider `askingRefreshToken` et son Notifier permettent de ne pas faire plusieurs fois la demande de rafraîchissement de token, qui serait refusée par l'API.