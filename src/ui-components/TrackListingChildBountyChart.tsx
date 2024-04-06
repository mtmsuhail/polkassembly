// Copyright 2019-2025 @polkassembly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { ResponsivePie } from '@nivo/pie';
import { BN } from 'bn.js';
import { useTheme } from 'next-themes';
import React, { FC, useEffect, useState } from 'react';
import { chainProperties } from '~src/global/networkConstants';
import { useNetworkSelector } from '~src/redux/selectors';
import { IChildBountiesResponse } from '~src/types';
import { formatedBalance } from '~src/util/formatedBalance';
import nextApiClientFetch from '~src/util/nextApiClientFetch';

interface ITrackListingChildBountyChart {
	parentBounty: any;
	status: string;
	requestedAmount: string;
	setTotalAmount: (pre: any) => void;
}

const ZERO_BN = new BN('0');

const TrackListingChildBountyChart: FC<ITrackListingChildBountyChart> = (props) => {
	const { network } = useNetworkSelector();
	const unit = `${chainProperties[network]?.tokenSymbol}`;
	const { parentBounty, requestedAmount, status, setTotalAmount } = props;
	const [amountDisbursed, setAmountDisbursed] = useState<any>('');
	const [remainingAmount, setRemainingAmount] = useState<any>('');
	const { resolvedTheme: theme } = useTheme();

	const getChildBountyData = async () => {
		const { data, error: fetchError } = await nextApiClientFetch<IChildBountiesResponse>('/api/v1/child_bounties/getAllChildBounties', {
			parentBountyIndex: parentBounty
		});
		if (fetchError || !data) {
			console.log('error fetching events : ', fetchError);
		}
		if (data?.child_bounties) {
			let totalAmount = ZERO_BN;
			let disbursedAmount = ZERO_BN;

			for (const bounty of data.child_bounties) {
				const bnAmount = new BN(bounty?.reward || '0');
				if (bounty?.status === 'Claimed') {
					disbursedAmount = disbursedAmount.add(bnAmount);
				}
				totalAmount = totalAmount.add(bnAmount);
			}

			if (!disbursedAmount.isZero()) {
				setAmountDisbursed(status === 'Claimed' ? disbursedAmount.sub(new BN(requestedAmount || '0')) : disbursedAmount);
			}

			if (!totalAmount.isZero()) {
				setTotalAmount(totalAmount);
				const remaining = totalAmount.sub(disbursedAmount);
				setRemainingAmount(status !== 'Claimed' ? remaining.sub(new BN(requestedAmount || '0')) : remaining);
			}
		}
	};

	useEffect(() => {
		getChildBountyData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [parentBounty, network]);

	const childBountyData = [
		{
			color: '#FFC302',
			id: 'disbursed',
			label: 'Disbursed',
			value: parseFloat(formatedBalance(amountDisbursed.toString(), unit).replace(/,/g, ''))
		},
		{
			color: '#F1F1EF',
			id: 'remaining',
			label: 'Remaining',
			value: parseFloat(formatedBalance(remainingAmount.toString(), unit).replace(/,/g, ''))
		},
		{
			color: '#FF8E11',
			id: 'requested',
			label: 'Requested',
			value: parseFloat((formatedBalance(requestedAmount.toString(), unit) as string).replace(/,/g, ''))
		}
	];

	return (
		<div className='-ml-[64px] mt-10 h-[150px] w-[142px]'>
			<ResponsivePie
				data={childBountyData}
				margin={{ bottom: 80, left: 80, right: 80, top: 40 }}
				innerRadius={0.7}
				cornerRadius={0}
				activeOuterRadiusOffset={0}
				borderWidth={1}
				borderColor={{
					from: 'color',
					modifiers: [['darker', 0.2]]
				}}
				enableArcLabels={false}
				enableArcLinkLabels={false}
				colors={({ data }) => data?.color}
				arcLinkLabelsSkipAngle={10}
				arcLinkLabelsTextColor='#333333'
				arcLinkLabelsThickness={2}
				arcLinkLabelsColor={{ from: 'color' }}
				arcLabelsSkipAngle={10}
				arcLabelsTextColor={{
					from: 'color',
					modifiers: [['darker', 2]]
				}}
				theme={{
					legends: {
						text: {
							fontSize: 12
						}
					},
					tooltip: {
						container: {
							background: theme === 'dark' ? '#282a2d' : '#363636',
							borderRadius: '6px',
							color: theme === 'dark' ? '#fff' : '#fff',
							fontSize: 14,
							padding: '8px 16px',
							textTransform: 'capitalize'
						}
					}
				}}
				valueFormat={(value) => `${value} ${unit}`}
				tooltip={() => {
					return (
						<div className={'w-[228px] rounded-md bg-[#363636] px-4 py-3 text-sm capitalize text-white dark:bg-[#1E2126]'}>
							<span className='text-xs font-semibold'>
								Disbursed: {parseFloat(formatedBalance(amountDisbursed.toString(), network).replace(/,/g, ''))} {unit}
							</span>
							<br />
							<span className='text-xs font-semibold'>
								Remaining: {parseFloat(formatedBalance(remainingAmount.toString(), network).replace(/,/g, '')).toFixed(2)} {unit}
							</span>
							<br />
							<span className='text-xs font-semibold'>
								Requested: {parseFloat(formatedBalance(requestedAmount.toString(), network).replace(/,/g, '')).toFixed(2)} {unit}
							</span>
						</div>
					);
				}}
			/>
		</div>
	);
};

export default TrackListingChildBountyChart;
