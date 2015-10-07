// Work in progress, fully working but no workflow to build the dist version yet
import _ from 'underscore';
import { ItemView } from 'backbone.marionette';

class ItemCollectionView extends ItemView {
   initialize (options) {
       _.extend(this, _.pick(options,
           'collectionAttribute',
           'collectionView',
           'collectionViewOptions',
           'collectionViewContainer'
       ));

       if (!this.collectionAttribute ||
           !this.collectionView ||
           !this.collectionViewContainer) {
           throw 'Properties missing: you need collectionAttribute, collectionView and collectionViewContainer';
       }
   }

   getCollectionView () {
       let collectionViewOptions = _.extend({}, this.collectionViewOptions, {
           collection: this.model.get(this.collectionAttribute),
       });

       this.collectionViewInstance = new this.collectionView(collectionViewOptions);

       return this.collectionViewInstance;
   }

   onRender () {
       let collectionView = this.getCollectionView();

       this.$(this.collectionViewContainer).html(collectionView.render().el.innerHTML);
   }

   onDestroy () {
       this.removeCollectionView();
   }

   removeCollectionView () {
       if (this.collectionViewInstance) {
           this.triggerMethod('before:remove:collectionView', this.collectionViewInstance);

           if (this.collectionViewInstance.destroy) {
               this.collectionViewInstance.destroy();
           }

           this.stopListening(this.collectionViewInstance);
           this.triggerMethod('remove:collectionView', this.collectionViewInstance);
       }
   }
}

export default ItemCollectionView;
