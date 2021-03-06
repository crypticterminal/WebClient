/* @ngInject */
function Key($http, url, srp) {
    const requestURL = url.build('keys');

    /**
     * Get public keys of the given emails addresses
     * @return {Promise}
     */
    const keys = (params = {}) => {
        return $http.get(requestURL(), params).then(({ data } = {}) => data);
    };

    /**
     * Create a new key
     * @param {Object} params
     * @return {Promise}
     */
    const create = (params = {}) => {
        return $http.post(requestURL(), params);
    };
    /**
     * Install a new key for each address
     * @param {Object} params
     * @return {Promise}
     */
    const setup = (params = {}, newPassword = '') => {
        if (newPassword.length) {
            return srp
                .getPasswordParams(newPassword, params)
                .then((authParams) => $http.post(requestURL('setup'), authParams));
        }

        return $http.post(requestURL('setup'), params);
    };
    /**
     * Install a new key for each address
     * @param {Object} params
     * @return {Promise}
     */
    const reset = (params = {}, newPassword = '') => {
        if (newPassword.length) {
            return srp
                .getPasswordParams(newPassword, params)
                .then((authParams) => $http.post(requestURL('reset'), authParams));
        }
        return $http.post(requestURL('reset'), params);
    };
    /**
     * Activate key
     * @param {String} keyID
     * @param {Object} params
     * @return {Promise}
     */
    const activate = (keyID, params = {}) => $http.put(requestURL(keyID, 'activate'), params);
    /**
     * Update private key only, use for password updates
     * @param {Object} params
     * @return {Promise}
     */
    const updatePrivate = (params = {}, newPassword = '') => {
        if (newPassword.length) {
            return srp
                .getPasswordParams(newPassword, params)
                .then((authParams) => $http.put(requestURL('private'), authParams));
        }
        return $http.put(requestURL('private'), params);
    };
    /**
     * Upgrade private key with incorrect metadata
     * @param {Object} params
     * @return {Promise}
     */
    const upgrade = (params = {}, newPassword = '') => {
        if (newPassword.length) {
            return srp
                .getPasswordParams(newPassword, params)
                .then((authParams) => $http.put(requestURL('private', 'upgrade'), authParams));
        }
        return $http.put(requestURL('private', 'upgrade'), params);
    };
    /**
     * Make a private key primary, only for activated keys
     * @param {String} keyID
     * @param {Object} params
     * @return {Promise}
     */
    const primary = (keyID, params) => {
        return $http.put(requestURL(keyID, 'primary'), params);
    };
    /**
     * Delete key
     * @param {String} keyID
     * @param {Object} params
     * @return {Promise}
     */
    const remove = (keyID, params) => {
        return $http.put(requestURL(keyID, 'delete'), params);
    };
    /**
     * Get salts
     * @return {Promise}
     */
    const salts = () => {
        return $http.get(requestURL('salts'));
    };
    /**
     * Update the key flags
     * @param {String} keyID
     * @param {Integer} params.Flags (bitmask: bit 0 enables verification, bit 1 enables encryption)
     * @param {Object} params.SignedKeyList
     * @return {Promise}
     */
    const flags = (keyID, params) => {
        return $http.put(requestURL(keyID, 'flags'), params);
    };
    /**
     * reactive key
     * @param {String} keyID
     * @return {Promise}
     */
    const reactivate = (keyID, params) => $http.put(requestURL(keyID), params);

    return { keys, create, setup, reset, primary, activate, updatePrivate, upgrade, remove, salts, reactivate, flags };
}
export default Key;
