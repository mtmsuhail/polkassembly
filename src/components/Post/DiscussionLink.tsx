// Copyright 2019-2025 @polkassembly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import Link from 'next/link';
import React, { FC, useEffect, useState } from 'react';
import { usePostDataContext } from '~src/context';

interface IDiscussionLinkProps {
    isOffchainPost: boolean;
}

const DiscussionLink: FC<IDiscussionLinkProps> = (props) => {
	const { isOffchainPost } = props;
	const { postData } = usePostDataContext();

	const [latestState, setLatestState] = useState({
		link: '',
		text: ''
	});
	useEffect(() => {
		const latestState = {
			link: '',
			text: ''
		};
		if (postData?.post_link) {
			const type = postData.post_link?.type;
			const id = postData.post_link?.id;
			if (!isOffchainPost) {
				if (type === 'discussions') {
					latestState.link = `/post/${id}`;
					latestState.text = `Discussion #${id}`;
				} else if (type === 'grants') {
					latestState.link = `/grant/${id}`;
					latestState.text = `Grant #${id}`;
				}
			} else {
				switch(type) {
				case 'referendums': {
					latestState.link = `/referendum/${id}`;
					latestState.text = `Referendum #${id}`;
					break;
				}
				case 'referendums_v2': {
					latestState.link = `/referenda/${id}`;
					latestState.text = `Referenda #${id}`;
					break;
				}
				case 'council_motions': {
					latestState.link = `/motion/${id}`;
					latestState.text = `Motion #${id}`;
					break;
				}
				case 'treasury_proposals': {
					latestState.link = `/treasury/${id}`;
					latestState.text = `Treasury Proposal #${id}`;
					break;
				}
				case 'democracy_proposals': {
					latestState.link = `/proposal/${id}`;
					latestState.text = `Proposal #${id}`;
					break;
				}
				case 'tips': {
					latestState.link = `/tip/${id}`;
					latestState.text = `Tip #${id}`;
					break;
				}
				case 'child_bounties': {
					latestState.link = `/child_bounty/${id}`;
					latestState.text = `Child Bounty #${id}`;
					break;
				}
				case 'bounties': {
					latestState.link = `/bounty/${id}`;
					latestState.text = `Bounty #${id}`;
					break;
				}
				case 'fellowship_referendums': {
					latestState.link = `/member-referenda/${id}`;
					latestState.text = `Member referenda #${id}`;
					break;
				}
				case 'tech_committee_proposals': {
					latestState.link = `/tech/${id}`;
					latestState.text = `Tech. Comm. Proposal #${id}`;
					break;
				}
				}
			}
		}
		setLatestState(latestState);
	}, [postData.post_link, isOffchainPost]);

	return (
		<>
			{
				latestState?.link?
					<Link href={latestState?.link!}>
						<span className="text-[#334D6E] flex">
							{latestState?.text.split('#').map((part, index) => {
								if (index === 0) {
									return part;
								} else {
									const id = part.match(/^\d+/)?.[0];
									return (
										<span key={index}>
											<span className="text-pink_primary"> #{id}</span>
										</span>
									);
								}
							})}
							<span>{' >> '}</span>
						</span>
					</Link>
					: null
			}
		</>
	);
};

export default DiscussionLink;