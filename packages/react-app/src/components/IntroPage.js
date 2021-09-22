import React, { useState, useEffect, Fragment } from "react";
import { Button, Form, Input } from "antd";
import { gql, useLazyQuery } from '@apollo/client'

import NFTImg from "./moa.png"; 
import CellsComponent from "./CellsComponent";

function IntroPage(props) {

    const [claimForm] = Form.useForm()
    const [mintSection, setMintSection] = useState('');
    const [certSection, setCertSection] = useState('');
    const [displaySection, setDisplaySection] = useState('');

    // get all the certificates that the owner owns.
    const CERTS_QUERY = gql`
    query Certs($owner: String!){
      certificates(where: { owner: $owner}) {
        id
        owner
        moaClaimed
      }
    }
    `
    const wrongNetworkHTML = <Fragment>You are on the wrong network. Please switch to mainnet on your web3 wallet and refresh the page.</Fragment>;

    const offlineHTML = <Fragment>
    [In order to mint a soul, you need to  have a web3/Ethereum-enabled browser and connect it (see top right of the page). Please download
      the <a href="https://metamask.io">MetaMask Chrome extension</a> or open in an Ethereum-compatible browser.]
    </Fragment>;

    function mintDefaultNFT() {
      props.mintNFT('default');
    }

    function mintDeluxeNFT() {
      props.mintNFT('deluxe');
    }

    function claimSoul(values) {
      console.log("claim!", values);
      props.claimSoul(values.certificateID.toString());
    }

    const [savedData, setSavedData] = useState(null);
    const [owner, setOwner] = useState(null);

    const [ getOwnedCerts, { loading, error, data }] = useLazyQuery(CERTS_QUERY, {fetchPolicy: 'network-only'});

    useEffect(() => {
      if(!!data) {
        if(savedData !== null) {
            setSavedData(data);
        } else { setSavedData(data); }
      }

    }, [data]);

    useEffect(() => {
      if(savedData !== null) {      
        console.log(savedData);

        const certHTML = <Fragment>
          {savedData.certificates.map(function(cert){
            let claimedIdStyle;
            if (cert.moaClaimed === true) { claimedIdStyle = {"text-decoration": "line-through"}; }
            return <Fragment> <span style={claimedIdStyle}>{cert.id}</span><br /></Fragment>;
          })}
        </Fragment>

        setCertSection(certHTML);
      }
    }, [savedData]); 

    useEffect(() => {
        if(typeof props.address !== 'undefined' && props.ACSigner !== null) {
          console.log(props.address.toLowerCase());
          let disabled = true; 
          var unix = Math.round(+new Date()/1000);
          if(unix >= 1632492000) { disabled = false; }

          const newMintHTML = <Fragment>
            The campaign runs from Friday 24 September 2021 at 14:00:00 GMT and will last until 22 October 14:00 GMT. <br />
            <br />
            {props.dfPrice} ETH (~$30). Available until 22 October 14:00 GMT. <br />
            <Button size={"small"} disabled={disabled} loading={props.minting} onClick={mintDefaultNFT}>
                Mint Sketched Soul.
            </Button>
            <br />
            <br />
            {props.dxPrice} ETH (~$200). Available until 96 are sold, or until 22 October 14:00 GMT.<br />
            <Button size={"small"} disabled={disabled} loading={props.minting} onClick={mintDeluxeNFT}>
                Mint Fully Painted Soul.
            </Button>
            <br />
            <br />
            If you own an Anchor Certificate, enter the ID to claim a fully painted soul for (gas costs only). An ID can only be claimed once. Already claimed IDs will display a very high gas cost and will not proceed. You'll soon (in the following weeks of the campaign) be able to see what IDs have been claimed.<br />
            <br />
            <Form layout="inline" size="small" form={claimForm} name="control-hooks" onFinish={claimSoul}>
            <Form.Item name="certificateID" rules={[
              { required: true,  message: "Certificate ID Required!"}
              ]}>
            <Input /> 
          </Form.Item> 
          <Form.Item>
            <Button htmlType="submit">
            Claim Soul 
            </Button>
          </Form.Item>
          </Form>
          <br />
          By minting, you agree to the <a href="https://github.com/Untitled-Frontier/tlatc/blob/master/TOS_PP.pdf">Terms of Service</a>.
          <br />
          <br />
          To see what Anchor Certificate IDs you own, fetch it with the button below. If it has already been claimed, it will have a line striked through it. Do not use these IDs. 
          <br />
          <br />
          <Button onClick={() => getOwnedCerts({ variables: { owner: props.address.toLowerCase() } })}>
            Fetch Anchor Certificate IDs
          </Button>
          <br />
          <br />
          </Fragment>

          setMintSection(newMintHTML);
        }
    }, [props.address, props.NFTSigner, props.minting]);

    useEffect(() => {
        if(props.injectedChainId !== props.hardcodedChainId && props.injectedChainId !== null) {
          setMintSection(wrongNetworkHTML);
        } else if(props.injectedChainId == null) {
          setMintSection(offlineHTML);
        }
      }, [props.hardcodedChainId, props.NFTSigner]);

    useEffect(() => {
      if(props.tokenId !== 0) {
        // new NFT was minted, thus display it.
        setDisplaySection(
          <Fragment>
            <h2>Your newly drawn painting of a forgotten soul.</h2>
            <CellsComponent tokenId={props.tokenId} NFTSigner={props.NFTSigner} /> <br />
            To interact with the NFT: to view it, to transfer it, and to see other NFTs, head to <a href="https://opensea.io/collection/paintings-of-forgotten-souls" target="_blank">OpenSea</a>. It's a platform to view and interact with NFTs, including Forgotten Souls. It will be in your profile. If you choose to mint another, new soul, it will update to display your new soul. All souls, however, are recorded
            on the Ethereum blockchain, and viewable in OpenSea.
          </Fragment>
        );
      }
    }, [props.tokenId, props.NFTSigner]);

    return (

        <div className="App" style={{textAlign:"justify"}}> 
        <img src={NFTImg} alt="Forgotten Souls" style={{display:"block", marginLeft:"auto", marginRight: "auto", maxWidth:"100%"}}/> <br />
        In the story, <a href="https://www.untitledfrontier.studio/blog/the-logged-universe-2-memories-of-atlas"> "Memories of Atlas" by Nathan Chen</a>, 
        many uploaded minds attempt to draw and capture the people they left behind. Some successful and some not.
        <br />
        <br />
        These painting of forgotten souls can be purchased as NFT memorabilia from the story. They come in the form on-chain generative art NFTs! 
        From September 24 2021 14:00 GMT until Friday 22 October 2021 (14:00 GMT), fans can mint fully painted or sketched souls.
        <br />
        <br />
        <h2>[] Fully Painted Souls</h2>
        Fully painted souls can be claimed for free (besides gas costs) if you own any Anchor Certificate (160 of both deluxe and default) from the previous 'Logged Universe' story. OR
        you can pay ~$200 (0.068 ETH) to generate a new soul to a maximum of 96 newly minted ones. This would bring the total to a maximum of 256 fully painted souls (160 claimable fully painted souls + 96 buyable fully painted souls). 
        To claim a fully painted soul is restricted by the time window. If you own an Anchor Certificate, it must be used to claim a soul within the campaign window.
        <br />
        <br />
        Each fully painted soul contains 8 layers of the painting, all with various colour palettes + unique randomised derivatives. In total there are over 32 randomised components to each fully painted soul. <br />
        <br />
        <h2>[] Sketches</h2>
        Many uploaded minds, as they lose their memory of their old lives in the physical world, lose their ability to depict their loved ones. 
        A sketch has the same features as a fully painted soul, but each layer (of 8) has a 50% chance of being drawn, resulting in various unfinished paintings.
        <br /><br />
        An infinite amount of sketches can be drawn until the end of the campaign date, at which point, no new sketches will be able to be minted.<br />
        <br />
        The components that make up the souls are licensed under <a href="https://creativecommons.org/licenses/by-sa/4.0/">CC BY-SA 4.0</a>. Thus, you are free to use the NFTs as you wish. <a href="https://github.com/Untitled-Frontier/moa">The code is available on Github.</a><br />
        <br />
        {/* MINT SECTION */}
        <div className="section">
        <h2>[] Mint</h2>
        {mintSection}
        {certSection}
        </div>
        <br />
        {displaySection}
        <br />
        <br />
        </div>
    );
}

export default IntroPage
