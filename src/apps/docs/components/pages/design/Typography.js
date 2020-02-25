import React from 'react';
import {withNamespaces} from '@gisatcz/ptr-locales';
import _ from 'lodash';

import Page from '../../Page';

const Typography = props => (
	<Page title="Typography">
		<div className="ptr-docs-panel-section">
			<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Quam id leo in vitae turpis. Egestas sed sed risus pretium quam. Suscipit adipiscing bibendum est ultricies integer quis auctor elit. Congue quisque egestas diam in.</p>
			<p>Ullamcorper a lacus vestibulum sed arcu. Nec ullamcorper sit amet risus nullam eget felis eget. Egestas diam in arcu cursus euismod quis viverra nibh cras. Iaculis at erat pellentesque adipiscing commodo elit at imperdiet dui. Lectus vestibulum mattis ullamcorper velit. In nulla posuere sollicitudin aliquam ultrices.</p>
			<h2>Basic</h2>
			<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Quam id leo in vitae turpis. Egestas sed sed risus pretium quam. Suscipit adipiscing bibendum est ultricies integer quis auctor elit. Congue quisque egestas diam in.</p>
			<p>Ullamcorper a lacus vestibulum sed arcu. Nec ullamcorper sit amet risus nullam eget felis eget. Egestas diam in arcu cursus euismod quis viverra nibh cras. Iaculis at erat pellentesque adipiscing commodo elit at imperdiet dui. Lectus vestibulum mattis ullamcorper velit. In nulla posuere sollicitudin aliquam ultrices.</p>
			<h3>In nulla posuere</h3>
			<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Quam id leo in vitae turpis. Egestas sed sed risus pretium quam. Suscipit adipiscing bibendum est ultricies integer quis auctor elit. Congue quisque egestas diam in.</p>
			<p>Ullamcorper a lacus vestibulum sed arcu. Nec ullamcorper sit amet risus nullam eget felis eget. Egestas diam in arcu cursus euismod quis viverra nibh cras. Iaculis at erat pellentesque adipiscing commodo elit at imperdiet dui. Lectus vestibulum mattis ullamcorper velit. In nulla posuere sollicitudin aliquam ultrices.</p>
			<h4>Ullamcorper a lacus</h4>
			<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Quam id leo in vitae turpis. Egestas sed sed risus <a href="#aaa">pretium</a> quam. Suscipit adipiscing bibendum est ultricies integer quis auctor elit. Congue quisque egestas diam in.</p>
			<p>Ullamcorper a lacus vestibulum sed arcu. Nec ullamcorper sit amet risus nullam eget felis eget. Egestas diam in arcu cursus euismod quis viverra nibh cras. Iaculis at erat pellentesque adipiscing commodo elit at imperdiet dui. Lectus vestibulum mattis ullamcorper velit. In nulla posuere sollicitudin aliquam ultrices.</p>
			<h5>In nulla posuere</h5>
			<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. <a href="#">Quam id leo in vitae turpis</a>. Egestas sed sed risus pretium quam. Suscipit adipiscing bibendum est ultricies integer quis auctor elit. Congue quisque egestas diam in.</p>
			<p>Ullamcorper a lacus vestibulum sed arcu. Nec ullamcorper sit amet risus nullam eget felis eget. Egestas diam in arcu cursus euismod quis viverra nibh cras. Iaculis at erat pellentesque adipiscing commodo elit at imperdiet dui. Lectus vestibulum mattis ullamcorper velit. In nulla posuere sollicitudin aliquam ultrices.</p>
			<h2>Basic</h2>
			<h3>Ullamcorper a lacus</h3>
			<p>Ullamcorper a lacus vestibulum sed arcu. Nec ullamcorper sit amet risus nullam eget felis eget. Egestas diam in arcu cursus euismod quis viverra nibh cras. Iaculis at erat pellentesque adipiscing commodo elit at imperdiet dui. Lectus vestibulum mattis ullamcorper velit. In nulla posuere sollicitudin aliquam ultrices.</p>
			<hr/>
			<h1>Nec ullamcorper sit amet risus nullam eget felis eget Egestas diam in arcu cursus euismod quis viverra nibh cras.</h1>
			<p>Ullamcorper a lacus vestibulum sed arcu. Nec ullamcorper sit amet risus nullam eget felis eget. Egestas diam in arcu cursus euismod quis viverra nibh cras. Iaculis at erat pellentesque adipiscing commodo elit at imperdiet dui. Lectus vestibulum mattis ullamcorper velit. In nulla posuere sollicitudin aliquam ultrices.</p>
			<h2>Nec ullamcorper sit amet risus nullam eget felis eget Egestas diam in arcu cursus euismod quis viverra nibh cras.</h2>
			<p>Ullamcorper a lacus vestibulum sed arcu. Nec ullamcorper sit amet risus nullam eget felis eget. Egestas diam in arcu cursus euismod quis viverra nibh cras. Iaculis at erat pellentesque adipiscing commodo elit at imperdiet dui. Lectus vestibulum mattis ullamcorper velit. In nulla posuere sollicitudin aliquam ultrices.</p>
			<h3>Nec ullamcorper sit amet risus nullam eget felis eget Egestas diam in arcu cursus euismod quis viverra nibh cras.</h3>
			<p>Ullamcorper a lacus vestibulum sed arcu. Nec ullamcorper sit amet risus nullam eget felis eget. Egestas diam in arcu cursus euismod quis viverra nibh cras. Iaculis at erat pellentesque adipiscing commodo elit at imperdiet dui. Lectus vestibulum mattis ullamcorper velit. In nulla posuere sollicitudin aliquam ultrices.</p>
			<h4>Nec ullamcorper sit amet risus nullam eget felis eget Egestas diam in arcu cursus euismod quis viverra nibh cras.</h4>
			<p>Ullamcorper a lacus vestibulum sed arcu. Nec ullamcorper sit amet risus nullam eget felis eget. Egestas diam in arcu cursus euismod quis viverra nibh cras. Iaculis at erat pellentesque adipiscing commodo elit at imperdiet dui. Lectus vestibulum mattis ullamcorper velit. In nulla posuere sollicitudin aliquam ultrices.</p>
			<h5>Nec ullamcorper sit amet risus nullam eget felis eget Egestas diam in arcu cursus euismod quis viverra nibh cras.</h5>
			<p>Ullamcorper a lacus vestibulum sed arcu. Nec ullamcorper sit amet risus nullam eget felis eget. Egestas diam in arcu cursus euismod quis viverra nibh cras. Iaculis at erat pellentesque adipiscing commodo elit at imperdiet dui. Lectus vestibulum mattis ullamcorper velit. In nulla posuere sollicitudin aliquam ultrices.</p>
		</div>
	</Page>
	);

export default withNamespaces()(Typography);