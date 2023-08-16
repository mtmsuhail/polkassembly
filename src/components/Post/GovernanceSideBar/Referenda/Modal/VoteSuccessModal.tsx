// Copyright 2019-2025 @polkassembly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React, { useEffect } from 'react';
import { Modal } from 'antd';
import CloseIcon from '~assets/icons/close.svg';
import { poppins } from 'pages/_app';
import BN from 'bn.js';

import { useNetworkContext } from '~src/context';
import Address from '~src/ui-components/Address';
import { formatBalance } from '@polkadot/util';
import { chainProperties } from '~src/global/networkConstants';
import AbstainGray from '~assets/icons/abstainGray.svg';
import { EVoteDecisionType } from '~src/types';
import { DislikeFilled, LikeFilled } from '@ant-design/icons';
import SplitYellow from '~assets/icons/split-yellow-icon.svg';
import { formatedBalance } from '~src/util/formatedBalance';
import { ReactElement } from 'react-markdown/lib/react-markdown';
import PostCommentForm from '~src/components/Post/PostCommentForm';
import styled from 'styled-components';
import QuoteRight from '~assets/icons/quote-right-icon.svg';
import QuoteLeft from '~assets/icons/quote-left-icon.svg';
//import { CommentBoxIcon } from 'src/ui-components/CustomIcons';
import CommentBox from '~assets/icons/comment-box-2.svg';

interface Props {
    className?: string;
    open: boolean;
    setOpen: (pre: boolean) => void;
    address: string;
    multisig?: string;
    balance: BN;
    conviction?: number;
    title: string;
    vote: EVoteDecisionType;
    votedAt: string;
    ayeVoteValue?: BN;
    nayVoteValue?: BN;
    abstainVoteValue?: BN;
	icon:ReactElement;
}

const VoteInitiatedModal = ({
	className,
	open,
	setOpen,
	address,
	multisig,
	balance,
	conviction,
	title,
	vote,
	votedAt,
	ayeVoteValue,
	nayVoteValue,
	abstainVoteValue,
	icon
}: Props) => {
	const { network } = useNetworkContext();
	const unit = `${chainProperties[network]?.tokenSymbol}`;
	useEffect(() => {
		if (!network) return;
		formatBalance.setDefaults({
			decimals: chainProperties[network].tokenDecimals,
			unit: chainProperties[network].tokenSymbol
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<Modal
			open={open}
			className={`${poppins.variable} ${poppins.className} delegate w-[604px]`}
			wrapClassName={className}
			closeIcon={<CloseIcon />}
			onCancel={() => setOpen(false)}
			centered
			footer={false}
			maskClosable={false}
		>
			<div className='flex justify-center items-center flex-col -mt-[132px]'>
				{icon}
				<h2 className='text-[20px] font-semibold tracking-[0.0015em] mt-2'>
					{title}
				</h2>
				<div className='flex flex-col justify-center items-center gap-[14px]'>
					<div className='text-pink_primary text-[24px] font-semibold'>
						{formatedBalance(balance.toString(), unit)}
						{` ${unit}`}
					</div>
					{vote === EVoteDecisionType.SPLIT && (
						<div className=' flex flex-wrap justify-center font-normal text-sm text-bodyBlue'>
							{' '}
							<span className='mr-3'>
								<span className='font-semibold'> Aye: </span>
								<span className='font-normal'>
									{ayeVoteValue
										? formatedBalance(
											ayeVoteValue.toString(),
											unit
										)
										: 0}
									{` ${unit}`}
								</span>
							</span>{' '}
							<span className='mr-3'>
								<span className='font-semibold'>Nay: </span>
								<span className='font-normal'>
									{nayVoteValue
										? formatedBalance(
											nayVoteValue.toString(),
											unit
										)
										: 0}
									{` ${unit}`}
								</span>
							</span>
						</div>
					)}
					{vote === EVoteDecisionType.ABSTAIN && (
						<div className='flex flex-wrap justify-center font-normal text-sm text-bodyBlue'>
							{' '}
							<span className='mr-3'>
								<span className='font-semibold'> Abstain:</span>{' '}
								<span className='font-normal'>
									{abstainVoteValue
										? formatedBalance(
											abstainVoteValue.toString(),
											unit
										)
										: 0}
									{` ${unit}`}
								</span>
							</span>{' '}
							<span className='mr-3'>
								{' '}
								<span className='font-semibold'>Aye:</span>{' '}
								<span className='font-normal'>
									{' '}
									{ayeVoteValue
										? formatedBalance(
											ayeVoteValue.toString(),
											unit
										)
										: 0}
									{` ${unit}`}
								</span>
							</span>{' '}
							<span className='mr-3'>
								<span className='font-semibold'>Nay:</span>{' '}
								<span className='font-normal'>
									{nayVoteValue
										? formatedBalance(
											nayVoteValue.toString(),
											unit
										)
										: 0}
									{` ${unit}`}
								</span>
							</span>
						</div>
					)}
					<div className='flex-col flex items-start justify-center gap-[10px]'>
						<div className='flex gap-3 text-sm text-[#485F7D] font-normal'>
                            With address:{' '}
							<span className='font-medium'>
								<Address
									address={address}
									className='address'
									displayInline={true}
								/>{' '}
							</span>
						</div>

						{multisig &&
							<div className='flex gap-[17px] text-sm text-[#485F7D] font-normal'>
								With Multisig:{' '}
								<span className='font-medium'>
									<Address
										address={multisig}
										className='address'
										displayInline={true}
									/>{' '}
								</span>
							</div>
						}

						<div className='flex h-[21px] gap-[70px] text-sm text-[#485F7D] font-normal'>
                            Vote :
							{vote === EVoteDecisionType.AYE ? (
								<p>
									<LikeFilled className='text-[green]' />{' '}
									<span className='capitalize font-medium text-bodyBlue'>
										{vote}
									</span>
								</p>
							) : vote === EVoteDecisionType.NAY ? (
								<div>
									<DislikeFilled className='text-[red]' />{' '}
									<span className='mb-[5px] capitalize font-medium text-bodyBlue'>
										{vote}
									</span>
								</div>
							) : vote === EVoteDecisionType.SPLIT ? (
								<p>
									<SplitYellow />{' '}
									<span className='capitalize font-medium text-bodyBlue'>
										{vote}
									</span>
								</p>
							) : vote === EVoteDecisionType.ABSTAIN ? (
								<p className='flex align-middle'>
									<AbstainGray className='mr-1' />{' '}
									<span className='capitalize font-medium text-bodyBlue'>
										{vote}
									</span>
								</p>
							) : null}
						</div>
						<div className='flex gap-[30px] text-sm text-[#485F7D] font-normal'>
							{' '}
                            Conviction:
							<span className='text-bodyBlue font-medium'>
								{conviction}x
							</span>{' '}
						</div>
						<div className='flex h-[21px] gap-[14px] text-sm text-[#485F7D] font-normal'>
                            Time of Vote :{' '}
							<span className='font-medium text-bodyBlue'>
								{votedAt}
							</span>
						</div>
						{ multisig &&
						<div className='flex h-[21px] gap-11 text-sm text-[#485F7D] font-normal'>
                            Vote Link:{' '}
							<span className='font-medium text-bodyBlue'>
								<a className='text-pink_primary' href='https://app.polkasafe.xyz/transactions' target='_blank' rel="noreferrer">Polkasafe</a>
							</span>
						</div>
						}
					</div>
				</div>
			</div>
			{/* <div className='relative min-h-[120px] mt-[30px]'>
				<QuoteRight className='absolute top-[-10px] left-[-10px]'/>
				<QuoteLeft className='absolute right-[0px] w-[34px] top-[-10px]' />
				<CommentBox className='w-[100%] min-h-[150px] box' />
				<p className='text-lightBlue text-[14px] font-medium mt-[-125px] pt-2 mb-2 ml-12 mr-4'>Your <span className='capitalize text-pink_primary '>&apos;{ vote }&apos;</span> vote is in! Mind sharing why you support this in a comment?</p>
				<PostCommentForm className='ml-8 mt-[-10px] w-[100%] mb-2' isUsedInSuccessModal={true} textBoxHeight={32} voteDecision={vote} setSuccessModalOpen={setOpen}/>
			</div> */}
			<div className='h-[130px] relative mt-[30px] '>
				<CommentBox />
				<QuoteRight className='absolute top-[-10px] left-[-10px]'/>
				<QuoteLeft className='absolute right-[0px] w-[34px] top-[-10px]' />
				<p className='text-lightBlue text-[14px] font-medium mt-[-127px] ml-6 mr-4 pt-2 mb-[-8px]'>Your <span className='capitalize text-pink_primary '>&apos;{ vote }&apos;</span> vote is in! Mind sharing why you support this in a comment?</p>
				<PostCommentForm className=' h-[150px] ml-8 mt-[-10px] w-[100%]' isUsedInSuccessModal={true} textBoxHeight={40} voteDecision={vote} setSuccessModalOpen={setOpen}/>
			</div>
		</Modal>
	);
};
export default styled(VoteInitiatedModal)`
.mde-header-group{
	display: none !important;
}
.mde-tabs{
	display: none !important;
}
.mde-text{
	padding: 10px !important;
	border-radius: 4px !important;
	min-height:40px;
	max-height: 40px;
}
.ant-avatar{
	display: none !important;
}
.anticon-info-circle{
	display: none !important;
}
.container{
	max-width: 100% !important;
}
.ant-form-item-explain-error{
	display: none !important;
}
`;
