//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
pragma experimental ABIEncoderV2;

import "@opengsn/contracts/src/BasePaymaster.sol";

/**
 * a paymaster for a single recipient contract.
 * - reject requests if destination is not the target contract.
 * - reject any request if the target contract reverts.
 */
contract PaymasterContract is BasePaymaster {

    address public target;
    address public userAddress = 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266;
    
    event TargetChanged(address oldTarget, address newTarget);

    function versionPaymaster() external view override virtual returns (string memory){
        return "3.0.0-beta.3+opengsn.recipient.ipaymaster";
    }

    function setTarget(address _target) external onlyOwner {
        emit TargetChanged(target, _target);
        target=_target;
    }

    function _preRelayedCall(
        GsnTypes.RelayRequest calldata relayRequest,
        bytes calldata signature,
        bytes calldata approvalData,
        uint256 maxPossibleGas
    )
    internal
    override
    virtual
    returns (bytes memory context, bool revertOnRecipientRevert) {
        (relayRequest, signature, approvalData, maxPossibleGas);
        // require(relayRequest.request.from==userAddress, "wrong target");
        require(relayRequest.request.to==target, "wrong user");
	//returning "true" means this paymaster accepts all requests that
	// are not rejected by the recipient contract.
        return ("", true);
    }

    function _postRelayedCall(
        bytes calldata context,
        bool success,
        uint256 gasUseWithoutPost,
        GsnTypes.RelayData calldata relayData
    )
    internal
    override
    virtual {
        (context, success, gasUseWithoutPost, relayData);
    }
}